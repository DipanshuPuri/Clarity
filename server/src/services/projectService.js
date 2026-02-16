const prisma = require('../utils/prismaClient');

const createProject = async (data) => {
    return await prisma.project.create({
        data: {
            name: data.name,
            problemStatement: data.problemStatement,
            successDefinition: data.successDefinition
        }
    });
};

const getAllProjects = async () => {
    return await prisma.project.findMany({
        include: {
            _count: {
                select: { intents: true }
            }
        }
    });
};

const getProjectById = async (id) => {
    return await prisma.project.findUnique({
        where: { id },
        include: {
            intents: {
                take: 5,
                orderBy: { title: 'asc' }
            }
        }
    });
};

const updateProject = async (id, data) => {
    return await prisma.project.update({
        where: { id },
        data: {
            name: data.name,
            problemStatement: data.problemStatement,
            successDefinition: data.successDefinition
        }
    });
};

const deleteProject = async (id) => {
    // Check for intents first (Manual guard if we want custom error message instead of Prisma error)
    const project = await prisma.project.findUnique({
        where: { id },
        include: { _count: { select: { intents: true } } }
    });

    if (!project) throw new Error('Project not found');
    if (project._count.intents > 0) {
        throw new Error('Cannot delete project with existing Intents. Archive it instead.');
    }

    return await prisma.project.delete({
        where: { id }
    });
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};
