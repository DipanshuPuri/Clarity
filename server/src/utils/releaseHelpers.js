const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const recalculateReleaseReadiness = async (releaseId) => {
    try {
        const allTickets = await prisma.ticket.findMany({
            where: {
                OR: [
                    { releases: { some: { id: releaseId } } },
                    { project: { releases: { some: { id: releaseId } } } }
                ]
            },
            select: { status: true }
        });

        if (allTickets.length === 0) {
            await prisma.release.update({
                where: { id: releaseId },
                data: { readinessScore: 0 }
            });
            return 0;
        }

        const doneCount = allTickets.filter(t => t.status.toLowerCase() === 'done').length;
        let score = (doneCount / allTickets.length) * 100;
        score = Math.round(score * 10) / 10;

        await prisma.release.update({
            where: { id: releaseId },
            data: { readinessScore: score }
        });

        return score;
    } catch (e) {
        console.error(`Error recalculating readiness for release ${releaseId}:`, e);
        return 0;
    }
};

const evaluateReleaseChecklists = async (releaseId) => {
    try {
        const checklists = await prisma.releaseChecklist.findMany({
            where: { releaseId, completionState: false }
        });

        if (checklists.length === 0) return;

        const release = await prisma.release.findUnique({
            where: { id: releaseId },
            include: { tickets: true }
        });

        if (!release || !release.tickets || release.tickets.length === 0) return;

        for (const item of checklists) {
            if (!item.autoValidationRule) continue;

            let rule;
            try {
                rule = typeof item.autoValidationRule === 'string' ? JSON.parse(item.autoValidationRule) : item.autoValidationRule;
            } catch (e) {
                continue;
            }

            if (rule && rule.type === 'TICKETS_IN_NODE' && rule.nodeName) {
                const targetNode = rule.nodeName.toLowerCase();
                const hasMatch = release.tickets.some(t =>
                    t.status.toLowerCase() === targetNode || t.status.toLowerCase() === 'done'
                );

                if (hasMatch) {
                    await prisma.releaseChecklist.update({
                        where: { id: item.id },
                        data: { completionState: true }
                    });
                }
            }
        }
    } catch (error) {
        console.error(`Error evaluating checklists for release ${releaseId}:`, error);
    }
};

const recalculateForTicket = async (ticketId, projectId) => {
    try {
        const affectedReleases = await prisma.release.findMany({
            where: {
                OR: [
                    { tickets: { some: { id: ticketId } } },
                    { projects: { some: { id: projectId } } }
                ]
            },
            select: { id: true }
        });

        for (const rel of affectedReleases) {
            await evaluateReleaseChecklists(rel.id);
            await recalculateReleaseReadiness(rel.id);
        }
    } catch (e) {
        console.error(`Error finding affected releases for ticket ${ticketId}:`, e);
    }
};

const computeReleaseBlockers = async (releaseId) => {
    try {
        const release = await prisma.release.findUnique({
            where: { id: releaseId },
            include: {
                tickets: true,
                projects: {
                    include: {
                        tickets: true
                    }
                }
            }
        });

        if (!release) return [];

        const ticketMap = new Map();
        release.tickets.forEach(t => ticketMap.set(t.id, t));
        release.projects.forEach(p => p.tickets.forEach(t => ticketMap.set(t.id, t)));
        const allTickets = Array.from(ticketMap.values());

        const workflowsByProject = {};
        const projectIds = release.projects.map(p => p.id);

        if (projectIds.length > 0) {
            const projectWorkflows = await prisma.project.findMany({
                where: { id: { in: projectIds } },
                include: {
                    workflows: { include: { nodes: true, edges: true } }
                }
            });

            projectWorkflows.forEach(p => {
                if (p.workflows && p.workflows.length > 0) {
                    workflowsByProject[p.id] = p.workflows.find(w => w.isDefault) || p.workflows[0];
                }
            });
        }

        const blockers = [];

        for (const ticket of allTickets) {
            if (ticket.status.toLowerCase() === 'done') continue;

            let isBlocking = false;
            let reasons = [];

            if (ticket.status.toLowerCase().includes('block') || ticket.status.toLowerCase() === 'on hold') {
                isBlocking = true;
                reasons.push('Explicitly marked as Blocked/On Hold');
            }

            const workflow = workflowsByProject[ticket.projectId];
            if (workflow) {
                const currentNode = workflow.nodes.find(n => n.name === ticket.status);
                if (currentNode && currentNode.type !== 'END') {
                    const outgoingEdges = workflow.edges.filter(e => e.fromNodeId === currentNode.id);
                    if (outgoingEdges.length === 0) {
                        isBlocking = true;
                        reasons.push('Orphaned state - no outgoing workflow transitions');
                    } else {
                        const hasPrereqs = outgoingEdges.some(e => {
                            try {
                                const rules = typeof e.rules === 'string' ? JSON.parse(e.rules) : e.rules;
                                return rules && (rules.requiresReview || (rules.prerequisites && rules.prerequisites.length > 0));
                            } catch (err) {
                                return false;
                            }
                        });
                        if (hasPrereqs) {
                            isBlocking = true;
                            reasons.push('Pending prerequisite or review transition');
                        }
                    }
                }
            } else {
                if (['Critical', 'High'].includes(ticket.priority)) {
                    isBlocking = true;
                    reasons.push('High priority incomplete task');
                }
            }

            if (isBlocking) {
                blockers.push({
                    ticketId: ticket.id,
                    title: ticket.title,
                    status: ticket.status,
                    priority: ticket.priority,
                    projectId: ticket.projectId,
                    reasons
                });
            }
        }

        return blockers;
    } catch (e) {
        console.error(`Error computing release blockers for release ${releaseId}:`, e);
        return [];
    }
};

const detectConflicts = async (currentRelease, currentTickets) => {
    const conflicts = [];
    const ticketIds = currentTickets.map(t => t.id);

    // Active other releases
    const otherActiveReleases = await prisma.release.findMany({
        where: {
            id: { not: currentRelease.id },
            status: { in: ['ACTIVE', 'FROZEN', 'READY'] }
        },
        include: {
            tickets: true,
            projects: { include: { tickets: true } }
        }
    });

    for (const other of otherActiveReleases) {
        const otherTicketMap = new Map();
        other.tickets.forEach(t => otherTicketMap.set(t.id, t));
        other.projects.forEach(p => p.tickets.forEach(t => otherTicketMap.set(t.id, t)));
        const otherTickets = Array.from(otherTicketMap.values());

        // 1. Same ticket inside two active releases
        const overlappingTickets = otherTickets.filter(t => ticketIds.includes(t.id));
        if (overlappingTickets.length > 0) {
            conflicts.push({
                type: 'MULTI_RELEASE_CONFLICT',
                message: `Overlap Conflict: Shares ${overlappingTickets.length} ticket(s) with active release "${other.name}"`,
                severity: 'WARNING'
            });
        }

        // 2. Overloaded Contributors across critical paths
        const myCriticals = currentTickets.filter(t => t.status.toLowerCase() !== 'done' && ['Critical', 'High'].includes(t.priority) && t.assigneeId);
        const theirCriticals = otherTickets.filter(t => t.status.toLowerCase() !== 'done' && ['Critical', 'High'].includes(t.priority) && t.assigneeId);

        const myAssignees = myCriticals.map(t => t.assigneeId);
        const theirAssignees = theirCriticals.map(t => t.assigneeId);

        const overloadedAssignees = myAssignees.filter(id => theirAssignees.includes(id));
        if (overloadedAssignees.length > 0) {
            const uniqueOverloads = [...new Set(overloadedAssignees)];
            conflicts.push({
                type: 'RESOURCE_CONTENTION',
                message: `Resource Contention: ${uniqueOverloads.length} contributor(s) are assigned to critical tickets across this release and "${other.name}"`,
                severity: 'WARNING'
            });
        }
    }

    // 3. Blocked Dependencies
    if (currentRelease.dependsOn && currentRelease.dependsOn.length > 0) {
        const blockedDeps = currentRelease.dependsOn.filter(d => ['PLANNING', 'ACTIVE', 'FROZEN'].includes(d.status) && d.readinessScore < 100);
        if (blockedDeps.length > 0) {
            conflicts.push({
                type: 'BLOCKED_DEPENDENCY',
                message: `Dependency Risk: Waiting on ${blockedDeps.length} incomplete release(s).`,
                severity: 'CRITICAL'
            });
        }
    }

    return conflicts;
}

const computeReleaseRisks = async (releaseId) => {
    try {
        const release = await prisma.release.findUnique({
            where: { id: releaseId },
            include: {
                tickets: true,
                projects: { include: { tickets: true } },
                checklists: true,
                dependsOn: true,
                dependedUponBy: true,
                engOwner: true,
                qaOwner: true,
                deployOwner: true
            }
        });

        if (!release) return { risks: [], readinessExplanations: [] };

        const risks = [];
        const explanations = [];

        const ticketMap = new Map();
        release.tickets.forEach(t => ticketMap.set(t.id, t));
        release.projects.forEach(p => p.tickets.forEach(t => ticketMap.set(t.id, t)));
        const allTickets = Array.from(ticketMap.values());

        // 1. Blocked Criticals & Incomplete Work
        let criticalIncomplete = 0;
        const blockers = await computeReleaseBlockers(releaseId);

        if (blockers.length > 0) {
            risks.push({ type: 'BLOCKED_TICKETS', message: `${blockers.length} tickets are currently blocking progress.`, severity: 'CRITICAL' });
            explanations.push(`${blockers.length} ticket(s) acting as blockers`);
        }

        allTickets.forEach(t => {
            if (t.status.toLowerCase() !== 'done' && ['Critical', 'High'].includes(t.priority)) {
                criticalIncomplete++;
            }
        });

        if (criticalIncomplete > 0) {
            risks.push({ type: 'CRITICAL_INCOMPLETE', message: `${criticalIncomplete} critical/high priority tickets remain incomplete.`, severity: 'WARNING' });
            explanations.push(`${criticalIncomplete} critical or high priority tickets incomplete`);
        } else if (allTickets.filter(t => t.status.toLowerCase() !== 'done').length > 0) {
            explanations.push(`${allTickets.filter(t => t.status.toLowerCase() !== 'done').length} total tickets incomplete`);
        }

        // 2. Overdue Target Dates
        if (release.targetDate && new Date() > new Date(release.targetDate)) {
            risks.push({ type: 'OVERDUE', message: `Release is PAST its target date of ${release.targetDate.toISOString().split('T')[0]}`, severity: 'CRITICAL' });
            explanations.push('Target delivery date is overdue');
        }

        // 3. Incomplete Checklists
        const pendingChecklists = release.checklists.filter(c => !c.completionState);
        if (pendingChecklists.length > 0) {
            risks.push({ type: 'CHECKLIST_PENDING', message: `${pendingChecklists.length} required checklist items are pending.`, severity: 'WARNING' });
            explanations.push(`${pendingChecklists.length} checklist items pending`);
        }

        // 4. Freeze Violations
        if (release.status === 'FROZEN' && release.readinessScore < 100) {
            risks.push({ type: 'FREEZE_VIOLATION', message: 'Release is FROZEN but readiness constraints are not met.', severity: 'CRITICAL' });
            explanations.push('Freeze protocol violation detected');
        }

        // 5. Missing Owners
        const missingRoles = [];
        if (!release.engOwnerId) missingRoles.push('Engineering');
        if (!release.qaOwnerId) missingRoles.push('QA');
        if (!release.deployOwnerId) missingRoles.push('Deployment');

        if (missingRoles.length > 0) {
            risks.push({ type: 'MISSING_OWNERS', message: `Missing required operational owners for: ${missingRoles.join(', ')}`, severity: 'CRITICAL' });
            explanations.push(`Missing ownership designations for ${missingRoles.join(', ')}`);
        }

        // 6. Multi-Release Conflict Engine
        const conflictRisks = await detectConflicts(release, allTickets);
        risks.push(...conflictRisks);

        return {
            risks,
            readinessExplanations: release.readinessScore < 100 ? explanations : []
        };
    } catch (e) {
        console.error(`Error computing release risks for ${releaseId}:`, e);
        return { risks: [], readinessExplanations: [] };
    }
};

const logReleaseAudit = async (releaseId, userId, eventType, reason) => {
    try {
        await prisma.releaseScopeAudit.create({
            data: { releaseId, userId, eventType, reason }
        });
    } catch (e) {
        console.error('Audit Error:', e);
    }
};

module.exports = {
    recalculateReleaseReadiness,
    recalculateForTicket,
    computeReleaseBlockers,
    evaluateReleaseChecklists,
    computeReleaseRisks,
    logReleaseAudit
};
