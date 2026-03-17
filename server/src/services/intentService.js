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

const getIntents = async ({ projectId, organizationId }) => {
    const where = {};

    // 1. Project Scoping (if provided and valid)
    if (projectId && projectId !== 'undefined') {
        where.projectId = projectId;
    }

    // 2. Organizational Scoping
    // If we have an organizationId, we must ensure the project belongs to it.
    if (organizationId) {
        where.project = {
            organizationId: organizationId
        };
    }

    return await prisma.intent.findMany({
        where,
        include: {
            _count: { select: { decisions: true } },
            tasks: true,
            project: { select: { name: true } }
        }
    });
};

const getIntentById = async (id, organizationId) => {
    return await prisma.intent.findFirst({
        where: {
            id,
            project: { organizationId }
        },
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
