const prisma = require('../utils/prismaClient');

const createOutcome = async (data) => {
    // Use a transaction to ensure Task is marked DONE only if Outcome is created successfully
    return await prisma.$transaction(async (tx) => {
        // 1. Validate Task exists and isn't already done
        const task = await tx.task.findUnique({ where: { id: data.taskId } });
        if (!task) throw new Error('Task not found');
        if (task.status === 'DONE') throw new Error('Task execution loop already closed');

        // 2. Create Outcome
        const outcome = await tx.outcome.create({
            data: {
                result: data.result,
                notes: data.notes,
                learning: data.learning,
                taskId: data.taskId
            }
        });

        // 3. Update Task Status
        await tx.task.update({
            where: { id: data.taskId },
            data: { status: 'DONE' }
        });

        return outcome;
    });
};

const updateOutcome = async () => {
    throw new Error('Outcomes are immutable records of history and cannot be modified.');
};

const deleteOutcome = async () => {
    throw new Error('Outcomes are permanent learning artifacts and cannot be deleted.');
};

const getOutcomeByTaskId = async (taskId) => {
    return await prisma.outcome.findUnique({
        where: { taskId }
    });
};

module.exports = {
    createOutcome,
    getOutcomeByTaskId
};
