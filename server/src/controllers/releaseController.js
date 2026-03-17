const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { recalculateReleaseReadiness, computeReleaseBlockers } = require('../utils/releaseHelpers');

const roleHierarchy = {
    INTERN: 1,
    MEMBER: 2,
    MANAGER: 3,
    INVESTOR: 4,
    ADMIN: 5,
    FOUNDER: 6
};

// Helper function to check minimum role requirement
const hasMinRole = (userRole, minRoleStr) => {
    return (roleHierarchy[userRole] || 0) >= roleHierarchy[minRoleStr];
};

exports.createRelease = async (req, res) => {
    try {
        const { name, description, targetDate, projectId, ticketId } = req.body;
        const organizationId = req.user.organizationId;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!hasMinRole(userRole, 'MANAGER')) {
            return res.status(403).json({ error: 'Creation requires MANAGER approval or higher.' });
        }

        const release = await prisma.release.create({
            data: {
                name,
                description,
                targetDate: targetDate ? new Date(targetDate) : null,
                organizationId,
                releaseOwnerId: userId,
                status: 'ACTIVE',
                projects: projectId ? { connect: { id: projectId } } : undefined,
                tickets: ticketId ? { connect: { id: ticketId } } : undefined
            }
        });

        res.status(201).json(release);
    } catch (error) {
        console.error("Error creating release:", error);
        res.status(500).json({ error: 'Failed to create release' });
    }
};

exports.getReleases = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const releases = await prisma.release.findMany({
            where: { organizationId },
            include: {
                releaseOwner: {
                    select: { id: true, firstName: true, lastName: true, profilePicture: true, position: true }
                },
                projects: {
                    select: { 
                        id: true, name: true, status: true,
                        members: { select: { id: true, firstName: true, lastName: true } }
                    }
                },
                tickets: {
                    select: { id: true, title: true, status: true, priority: true, projectId: true }
                },
                _count: {
                    select: { tickets: true }
                },
                dependsOn: { select: { id: true } },
                dependedUponBy: { select: { id: true } },
                engOwner: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
                qaOwner: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
                deployOwner: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
                checklists: true,
                audits: {
                    include: { user: { select: { firstName: true, lastName: true, profilePicture: true } } },
                    orderBy: { timestamp: 'desc' },
                    take: 5
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const enrichedReleases = await Promise.all(releases.map(async (rel) => {
            const blockingTickets = await computeReleaseBlockers(rel.id);
            return { ...rel, blockingTickets };
        }));

        res.status(200).json(enrichedReleases);
    } catch (error) {
        console.error("Error fetching releases:", error);
        res.status(500).json({ error: 'Failed to fetch releases', msg: error.message, stack: error.stack });
    }
};

exports.getReleaseById = async (req, res) => {
    try {
        const { id } = req.params;
        const organizationId = req.user.organizationId;

        const release = await prisma.release.findFirst({
            where: { id, organizationId },
            include: {
                releaseOwner: {
                    select: { id: true, firstName: true, lastName: true, profilePicture: true, position: true }
                },
                projects: true,
                tickets: true,
                checklists: true,
                engOwner: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
                qaOwner: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
                deployOwner: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
                audits: {
                    include: { user: { select: { firstName: true, lastName: true, profilePicture: true } } },
                    orderBy: { timestamp: 'desc' }
                },
                deployments: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!release) return res.status(404).json({ error: 'Release not found' });

        const blockingTickets = await computeReleaseBlockers(release.id);

        res.status(200).json({ ...release, blockingTickets });
    } catch (error) {
        console.error("Error fetching release:", error);
        res.status(500).json({ error: 'Failed to fetch release' });
    }
};

exports.updateReleaseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const organizationId = req.user.organizationId;
        const userRole = req.user.role;

        const release = await prisma.release.findFirst({
            where: { id, organizationId }
        });

        if (!release) return res.status(404).json({ error: 'Release not found' });

        const currentStatus = release.status;

        // Define allowable transitions map
        const transitions = {
            'ACTIVE': ['FROZEN', 'READY', 'ARCHIVED'],
            'FROZEN': ['READY', 'ACTIVE', 'ARCHIVED'], 
            'READY': ['DEPLOYED', 'ACTIVE', 'ARCHIVED'], 
            'DEPLOYED': ['ARCHIVED'],
            'ARCHIVED': [] // Terminal state
        };

        const allowedNextStates = transitions[currentStatus] || [];
        if (!allowedNextStates.includes(status)) {
            return res.status(400).json({ error: `Illegal state transition: ${currentStatus} -> ${status}` });
        }

        // Enforce RBAC for specific states
        if (status === 'FROZEN' && !hasMinRole(userRole, 'ADMIN') && userRole !== 'FOUNDER') {
            return res.status(403).json({ error: 'Transition to FROZEN requires ADMIN privileges or higher.' });
        }
        if (status === 'DEPLOYED' && !hasMinRole(userRole, 'ADMIN') && userRole !== 'FOUNDER') {
            return res.status(403).json({ error: 'Deployment requires ADMIN privileges or higher.' });
        }

        let freezeDate = release.freezeDate;
        if (status === 'FROZEN' && currentStatus !== 'FROZEN') {
            freezeDate = new Date();
        }

        let workflowSnapshot = release.workflowSnapshot || undefined;
        let contextSnapshot = release.contextSnapshot || undefined;

        if (status === 'ACTIVE' && currentStatus === 'PLANNING') {
            const snapshotData = await prisma.release.findUnique({
                where: { id },
                include: { tickets: true, projects: { include: { workflows: true } }, checklists: true }
            });
            workflowSnapshot = snapshotData.projects.map(p => ({ projectId: p.id, workflows: p.workflows }));
            contextSnapshot = {
                tickets: snapshotData.tickets,
                checklists: snapshotData.checklists,
                engOwnerId: snapshotData.engOwnerId,
                qaOwnerId: snapshotData.qaOwnerId,
                deployOwnerId: snapshotData.deployOwnerId
            };
        }

        const updatedRelease = await prisma.release.update({
            where: { id },
            data: { status, freezeDate, workflowSnapshot, contextSnapshot }
        });

        // Log the transition as a deployment log if it's significant
        if (['FROZEN', 'READY', 'DEPLOYED'].includes(status)) {
            await prisma.deploymentLog.create({
                data: {
                    releaseId: id,
                    environment: status === 'DEPLOYED' ? 'production' : 'staging',
                    deployedById: req.user.id,
                    logBody: `State transitioned to ${status} by ${req.user.firstName || req.user.email}`
                }
            });
        }

        res.status(200).json(updatedRelease);
    } catch (error) {
        console.error("Error updating release status:", error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

exports.linkProjectToRelease = async (req, res) => {
    try {
        const { id } = req.params;
        const { projectId } = req.body;
        const organizationId = req.user.organizationId;

        const release = await prisma.release.findFirst({ where: { id, organizationId } });
        if (!release) return res.status(404).json({ error: 'Release not found' });

        await prisma.release.update({
            where: { id },
            data: { projects: { connect: { id: projectId } } }
        });

        const { recalculateReleaseReadiness, logReleaseAudit } = require('../utils/releaseHelpers');
        logReleaseAudit(id, req.user.id, 'project_added', `Project ${projectId} added to release scope`);
        recalculateReleaseReadiness(id).catch(console.error);

        res.status(200).json({ message: 'Project linked successfully' });
    } catch (e) {
        res.status(500).json({ error: 'Failed to link project' });
    }
};

exports.linkTicketToRelease = async (req, res) => {
    try {
        const { id } = req.params;
        const { ticketId } = req.body;
        const organizationId = req.user.organizationId;

        const release = await prisma.release.findFirst({ where: { id, organizationId } });
        if (!release) return res.status(404).json({ error: 'Release not found' });

        await prisma.release.update({
            where: { id },
            data: { tickets: { connect: { id: ticketId } } }
        });

        const { recalculateReleaseReadiness, logReleaseAudit } = require('../utils/releaseHelpers');
        logReleaseAudit(id, req.user.id, 'ticket_added', `Ticket ${ticketId} appended to release scope`);
        recalculateReleaseReadiness(id).catch(console.error);

        res.status(200).json({ message: 'Ticket linked successfully' });
    } catch (e) {
        res.status(500).json({ error: 'Failed to link ticket' });
    }
};

exports.toggleChecklist = async (req, res) => {
    try {
        const { id, checklistId } = req.params;
        const { completionState } = req.body;
        const userRole = req.user.role;

        if (!hasMinRole(userRole, 'ADMIN')) {
            return res.status(403).json({ error: 'Manual checklist toggle requires ADMIN privileges.' });
        }

        const checklist = await prisma.releaseChecklist.findFirst({
            where: { id: checklistId, releaseId: id }
        });

        if (!checklist) {
            return res.status(404).json({ error: 'Checklist item not found.' });
        }

        const updatedChecklist = await prisma.releaseChecklist.update({
            where: { id: checklistId },
            data: { completionState }
        });

        recalculateReleaseReadiness(id).catch(console.error);

        res.status(200).json(updatedChecklist);
    } catch (error) {
        console.error("Error toggling checklist:", error);
        res.status(500).json({ error: 'Failed to toggle checklist' });
    }
};

exports.deployRelease = async (req, res) => {
    try {
        const { id } = req.params;
        const { environment } = req.body;
        const organizationId = req.user.organizationId;

        if (!hasMinRole(req.user.role, 'ADMIN')) {
            return res.status(403).json({ error: 'Deployments require ADMIN privileges.' });
        }

        const release = await prisma.release.findFirst({
            where: { id, organizationId },
            include: { tickets: true }
        });

        if (!release) return res.status(404).json({ error: 'Release not found' });

        const ticketsShipped = release.tickets.map(t => ({ id: t.id, title: t.title, status: t.status }));

        const deploymentLog = await prisma.deploymentLog.create({
            data: {
                releaseId: id,
                environment: environment || 'Production',
                deployedById: req.user.id,
                logBody: `Deployed to ${environment || 'Production'}`,
                ticketsShipped
            }
        });

        const stabilizationEnd = new Date();
        stabilizationEnd.setHours(stabilizationEnd.getHours() + 72);

        const updatedRelease = await prisma.release.update({
            where: { id },
            data: {
                status: 'STABILIZATION',
                stabilizationEnd
            }
        });

        res.status(200).json({ release: updatedRelease, deploymentLog });
    } catch (e) {
        console.error("Deploy error:", e);
        res.status(500).json({ error: 'Failed to deploy release' });
    }
};

exports.getReleaseRisks = async (req, res) => {
    try {
        const { id } = req.params;
        const { computeReleaseRisks } = require('../utils/releaseHelpers');
        const risksData = await computeReleaseRisks(id);
        res.status(200).json(risksData);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch release risks.' });
    }
};

exports.updateRelease = async (req, res) => {
    try {
        const { id } = req.params;
        const organizationId = req.user.organizationId;
        const data = req.body;

        const release = await prisma.release.findFirst({ where: { id, organizationId } });
        if (!release) return res.status(404).json({ error: 'Release not found' });

        if (!hasMinRole(req.user.role, 'MANAGER')) {
            return res.status(403).json({ error: 'Modifications require MANAGER approval.' });
        }

        const updatedRelease = await prisma.release.update({
            where: { id },
            data,
            include: {
                releaseOwner: {
                    select: { id: true, firstName: true, lastName: true, profilePicture: true, position: true }
                },
                engOwner: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
                qaOwner: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
                deployOwner: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
                projects: true,
                checklists: true,
                audits: {
                    include: { user: { select: { firstName: true, lastName: true, profilePicture: true } } },
                    orderBy: { timestamp: 'desc' }
                }
            }
        });

        const { logReleaseAudit, recalculateReleaseReadiness } = require('../utils/releaseHelpers');

        if (data.targetDate) logReleaseAudit(id, req.user.id, 'deadline_changed', `Target date updated to ${data.targetDate}`);
        if (data.engOwnerId || data.qaOwnerId || data.deployOwnerId) logReleaseAudit(id, req.user.id, 'owner_changed', `Ownership map updated`);

        recalculateReleaseReadiness(id).catch(console.error);

        res.status(200).json(updatedRelease);
    } catch (error) {
        console.error("Error updating release:", error);
        res.status(500).json({ error: 'Failed to update release' });
    }
};

exports.rollbackDeployment = async (req, res) => {
    try {
        const { id } = req.params;
        const { deploymentLogId } = req.body;
        const userRole = req.user.role;

        if (!hasMinRole(userRole, 'ADMIN')) {
            return res.status(403).json({ error: 'Rollbacks require ADMIN privileges.' });
        }

        const log = await prisma.deploymentLog.findUnique({ where: { id: deploymentLogId } });
        if (!log || log.releaseId !== id) return res.status(404).json({ error: 'Log not found' });

        await prisma.deploymentLog.update({
            where: { id: deploymentLogId },
            data: { rollbackFlag: true }
        });

        const shippedTickets = log.ticketsShipped || [];
        const ticketIds = shippedTickets.map(t => t.id);

        if (ticketIds.length > 0) {
            await prisma.ticket.updateMany({
                where: { id: { in: ticketIds } },
                data: { status: 'In Progress' }
            });
        }

        const release = await prisma.release.update({
            where: { id },
            data: { status: 'DEGRADED', stabilizationEnd: null }
        });

        const { recalculateReleaseReadiness, logReleaseAudit } = require('../utils/releaseHelpers');
        recalculateReleaseReadiness(id).catch(console.error);
        logReleaseAudit(id, req.user.id, 'ROLLBACK', `Forced rollback of deployment log ${log.id}`);

        res.status(200).json({ message: 'Rollback executed.', release });
    } catch (error) {
        console.error("Rollback error:", error);
        res.status(500).json({ error: 'Failed to rollback deployment' });
    }
};

exports.simulateFreeze = async (req, res) => {
    try {
        const { id } = req.params;
        const { computeReleaseRisks } = require('../utils/releaseHelpers');

        // Simulate freeze by running the risk engine
        const risksData = await computeReleaseRisks(id);

        // Gather simulation metrics based on current risks
        const criticalRisks = risksData.risks.filter(r => r.severity === 'CRITICAL');

        res.status(200).json({
            remainingCritical: criticalRisks.length,
            predictedDelayDays: criticalRisks.length > 0 ? criticalRisks.length * 2 : 0,
            riskProjection: risksData.risks.map(r => r.message)
        });
    } catch (e) {
        console.error("Simulation error:", e);
        res.status(500).json({ error: 'Failed to simulate freeze impact.' });
    }
};

exports.deleteRelease = async (req, res) => {
    try {
        const { id } = req.params;
        const organizationId = req.user.organizationId;
        const userRole = req.user.role;

        const release = await prisma.release.findFirst({
            where: { id, organizationId }
        });

        if (!release) return res.status(404).json({ error: 'Release not found' });

        if (!hasMinRole(userRole, 'MANAGER')) {
            return res.status(403).json({ error: 'Deletion requires MANAGER privileges or higher.' });
        }

        // Cleanup related records - Prisma handles most via Cascade but we'll be explicit for Audit if needed
        // or just let the main delete handle it.
        await prisma.release.delete({
            where: { id }
        });

        res.status(200).json({ message: 'Release deleted successfully' });
    } catch (error) {
        console.error("Error deleting release:", error);
        res.status(500).json({ error: 'Failed to delete release' });
    }
};
