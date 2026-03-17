const prisma = require('../utils/prismaClient');

const createDecision = async (data, authorId) => {
    return await prisma.decision.create({
        data: {
            title: data.title,
            chosenOption: data.chosenOption,
            rationale: data.rationale,
            rejectedAlternatives: data.rejectedAlternatives,
            tradeoffs: data.tradeoffs,
            expectedOutcome: data.expectedOutcome,
            status: data.status || 'PROPOSED',
            intentId: data.intentId,
            authorId: authorId
        }
    });
};

const getDecisions = async ({ intentId, organizationId }) => {
    const where = {};

    // 1. Intent Scoping (if provided and valid)
    if (intentId && intentId !== 'undefined') {
        where.intentId = intentId;
    }

    // 2. Organizational Scoping
    // If we have an organizationId, we must ensure the decision belongs to it.
    // Lineage: Decision -> Intent -> Project -> Organization
    if (organizationId) {
        where.intent = {
            project: {
                organizationId: organizationId
            }
        };
    }

    return await prisma.decision.findMany({
        where,
        include: {
            author: { select: { email: true, role: true, firstName: true, lastName: true } },
            intent: {
                select: {
                    title: true,
                    project: { select: { name: true } }
                }
            },
            _count: { select: { tasks: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getDecisionById = async (id, organizationId) => {
    return await prisma.decision.findFirst({
        where: {
            id,
            intent: {
                project: { organizationId }
            }
        },
        include: {
            author: { select: { email: true, firstName: true, lastName: true } },
            intent: { select: { id: true, title: true } },
            tasks: true,
            _count: { select: { tasks: true } }
        }
    });
};

const updateDecision = async (id, data) => {
    const existing = await prisma.decision.findUnique({
        where: { id },
        include: { _count: { select: { tasks: true } } }
    });

    if (existing && existing._count.tasks > 0) {
        // Allow status updates but maybe restrict content changes? 
        // User said "read-only", usually implies NO edits. 
        // But for now, let's strictly block if tasks exist as requested "Decision becomes read-only".
        // Use a flag or check specific fields?
        // Let's assume FULL read-only for now if tasks exist.
        throw new Error('Decision is immutable because tasks have already been assigned for execution.');
    }

    return await prisma.decision.update({
        where: { id },
        data: {
            title: data.title,
            chosenOption: data.chosenOption,
            rationale: data.rationale,
            rejectedAlternatives: data.rejectedAlternatives,
            tradeoffs: data.tradeoffs,
            expectedOutcome: data.expectedOutcome,
            status: data.status
        }
    });
};

const deleteDecision = async (id) => {
    // Check dependency manually for clear error
    const decision = await prisma.decision.findUnique({
        where: { id },
        include: { _count: { select: { tasks: true } } }
    });

    if (!decision) throw new Error('Decision not found');
    if (decision._count.tasks > 0) {
        throw new Error('Cannot delete Decision: It has linked Tasks. Delete tasks first.');
    }

    return await prisma.decision.delete({
        where: { id }
    });
};

module.exports = {
    createDecision,
    getDecisions,
    getDecisionById,
    updateDecision,
    deleteDecision
};
