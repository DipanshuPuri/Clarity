const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const roleHierarchy = {
    INTERN: 1,
    MEMBER: 2,
    MANAGER: 3,
    INVESTOR: 4,
    ADMIN: 5,
    FOUNDER: 6
};

const hasMinRole = (userRole, minRoleStr) => {
    return (roleHierarchy[userRole] || 0) >= roleHierarchy[minRoleStr];
};

const checkTicketFreeze = async (req, res, next) => {
    try {
        // Find ticketId either from params or body (for actions like handoff)
        const ticketId = req.params.id || req.body.ticketId;
        if (!ticketId) return next();

        // Check if user is overriding with ADMIN power
        if (req.body.overrideFreeze && hasMinRole(req.user.role, 'ADMIN')) {
            return next();
        }

        const releases = await prisma.release.findMany({
            where: {
                tickets: { some: { id: ticketId } },
                status: 'FROZEN'
            }
        });

        if (releases.length > 0) {
            return res.status(403).json({
                error: 'Ticket belongs to a FROZEN release. Modification blocked.',
                blockedBy: releases.map(r => r.name)
            });
        }
        next();
    } catch (error) {
        console.error("Freeze Guard Error:", error);
        res.status(500).json({ error: "Failed to verify freeze status." });
    }
};

const checkProjectFreeze = async (req, res, next) => {
    try {
        const projectId = req.params.id || req.body.projectId;
        if (!projectId) return next();

        // Check if user is overriding
        if (req.body.overrideFreeze && hasMinRole(req.user.role, 'ADMIN')) {
            return next();
        }

        const releases = await prisma.release.findMany({
            where: {
                projects: { some: { id: projectId } },
                status: 'FROZEN'
            }
        });

        if (releases.length > 0) {
            // Only block if they are modifying the deadline
            if (req.body.deadline !== undefined) {
                return res.status(403).json({
                    error: 'Project belongs to a FROZEN release. Deadline modification blocked.',
                    blockedBy: releases.map(r => r.name)
                });
            }
        }
        next();
    } catch (error) {
        console.error("Freeze Guard Error:", error);
        res.status(500).json({ error: "Failed to verify freeze status." });
    }
};

const checkReleaseScopeFreeze = async (req, res, next) => {
    try {
        const releaseId = req.params.id;
        if (!releaseId) return next();

        if (req.body.overrideFreeze && (hasMinRole(req.user.role, 'ADMIN') || req.user.role === 'FOUNDER')) {
            return next();
        }

        const release = await prisma.release.findUnique({ where: { id: releaseId } });
        if (release && release.status === 'FROZEN') {
            return res.status(403).json({ error: 'Release is FROZEN. Scope modifications blocked. Requires override.' });
        }
        next();
    } catch (error) {
        console.error("Freeze Guard Error:", error);
        res.status(500).json({ error: "Failed to verify freeze status." });
    }
}

module.exports = { checkTicketFreeze, checkProjectFreeze, checkReleaseScopeFreeze };
