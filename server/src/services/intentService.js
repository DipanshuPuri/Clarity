const prisma = require('../utils/prismaClient');

const createIntent = async (data) => {
    return await prisma.intent.create({
        data: {
            title: data.title,
            assumption: data.assumption,
            successSignal: data.successSignal,
            status: 'ACTIVE',
            projectId: data.projectId
        }
    });
};

const getIntents = async (filters) => {
    const where = {};
    if (filters.projectId) where.projectId = filters.projectId;

    return await prisma.intent.findMany({
        where,
        include: {
            _count: { select: { decisions: true } },
            tasks: true
        }
    });
};

const getIntentById = async (id) => {
    return await prisma.intent.findUnique({
        where: { id },
        include: {
            decisions: true,
            _count: { select: { decisions: true } }
        }
    });
};

const updateIntent = async (id, data) => {
    const existing = await prisma.intent.findUnique({
        where: { id },
        include: { _count: { select: { decisions: true } } }
    });

    if (existing && existing._count.decisions > 0) {
        throw new Error('Intent is read-only because decisions have already been recorded.');
    }

    return await prisma.intent.update({
        where: { id },
        data
    });
};

module.exports = { createIntent, getIntents, getIntentById, updateIntent };
