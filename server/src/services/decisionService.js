const prisma = require('../utils/prismaClient');

const createDecision = async (data, authorId) => {
    return await prisma.decision.create({
        data: {
            title: data.title,
            chosenOption: data.chosenOption,
            rationale: data.rationale,
            rejectedAlternatives: data.rejectedAlternatives,
            status: data.status || 'PROPOSED',
            intentId: data.intentId,
            authorId: authorId
        }
    });
};

const getDecisions = async (filters) => {
    const where = {};
    if (filters.intentId) where.intentId = filters.intentId;

    return await prisma.decision.findMany({
        where,
        include: {
            author: { select: { email: true, role: true } },
            _count: { select: { tasks: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getDecisionById = async (id) => {
    return await prisma.decision.findUnique({
        where: { id },
        include: {
            author: { select: { email: true } },
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
        throw new Error('Decision is immutable because tasks have already been assigned for execution.');
    }

    return await prisma.decision.update({
        where: { id },
        data: {
            title: data.title,
            chosenOption: data.chosenOption,
            rationale: data.rationale,
            rejectedAlternatives: data.rejectedAlternatives,
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
