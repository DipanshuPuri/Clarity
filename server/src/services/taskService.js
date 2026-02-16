const prisma = require('../utils/prismaClient');

const createTask = async (data) => {
    if (!data.decisionId) {
        throw new Error('Structural Violation: Tasks must be linked to a strategic Decision.');
    }
    return await prisma.task.create({
        data: {
            title: data.title,
            executionDescription: data.executionDescription,
            expectedOutcome: data.expectedOutcome,
            status: 'TODO',
            intentId: data.intentId,
            decisionId: data.decisionId,
            assigneeId: data.assigneeId || null
        }
    });
};

const getTasks = async (filters) => {
    const where = {};
    if (filters.intentId) where.intentId = filters.intentId;
    if (filters.decisionId) where.decisionId = filters.decisionId;
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;

    return await prisma.task.findMany({
        where,
        include: {
            decision: true,
            assignee: { select: { email: true } },
            outcome: true
        }
    });
};

const getTaskById = async (id) => {
    return await prisma.task.findUnique({
        where: { id },
        include: {
            decision: true,
            assignee: true,
            outcome: true
        }
    });
};

const updateTask = async (id, data) => {
    // Rule: Cannot mark Done without Outcome
    if (data.status === 'DONE') {
        const task = await prisma.task.findUnique({
            where: { id },
            include: { outcome: true }
        });

        // If we're patching the status to DONE, checks if outcome exists
        if (!task.outcome) {
            // Check if data ALSO includes creating an outcome? 
            // For now, assume Outcome is created separately.
            throw new Error('Rule Violation: Cannot mark Task as DONE without a recorded Outcome.');
        }
    }

    return await prisma.task.update({
        where: { id },
        data: {
            title: data.title,
            executionDescription: data.executionDescription,
            expectedOutcome: data.expectedOutcome,
            status: data.status,
            assigneeId: data.assigneeId
        }
    });
};

const deleteTask = async (id) => {
    return await prisma.task.delete({
        where: { id }
    });
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};
