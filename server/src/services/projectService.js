const prisma = require('../utils/prismaClient');

const createProject = async (data) => {
    return await prisma.project.create({
        data: {
            name: data.name,
            problemStatement: data.problemStatement,
            successDefinition: data.successDefinition,
            budget: data.budget ? parseFloat(data.budget) : null,
            deadline: data.deadline ? new Date(data.deadline) : null,
            status: data.status || "Ongoing",
            priority: data.priority || "Medium",
            team: data.team,
            organizationId: data.organizationId
        },
        include: {
            tickets: true
        }
    });
};

const getAllProjects = async (organizationId) => {
    return await prisma.project.findMany({
        where: { organizationId },
        include: {
            tickets: {
                include: {
                    assignee: true,
                    handoffs: { orderBy: { createdAt: 'desc' } },
                    releases: { select: { id: true, name: true, status: true } }
                }
            },
            members: true
        },
        orderBy: { updatedAt: 'desc' }
    });
};

const getProjectById = async (id, organizationId) => {
    return await prisma.project.findFirst({
        where: {
            id,
            organizationId
        },
        include: {
            tickets: {
                include: {
                    assignee: true,
                    handoffs: { orderBy: { createdAt: 'desc' } },
                    releases: { select: { id: true, name: true, status: true } }
                }
            },
            members: true
        }
    });
};

const updateProject = async (id, data) => {
    return await prisma.project.update({
        where: { id },
        data: {
            name: data.name,
            problemStatement: data.problemStatement,
            successDefinition: data.successDefinition,
            budget: data.budget ? parseFloat(data.budget) : undefined,
            deadline: data.deadline ? new Date(data.deadline) : undefined,
            status: data.status,
            priority: data.priority,
            team: data.team
        }
    });
};

const deleteProject = async (id) => {
    const project = await prisma.project.findUnique({
        where: { id }
    });

    if (!project) throw new Error('Project not found');

    return await prisma.project.delete({
        where: { id }
    });
};

const addMember = async (projectId, userId) => {
    return await prisma.project.update({
        where: { id: projectId },
        data: {
            members: {
                connect: { id: userId }
            }
        },
        include: { members: true }
    });
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember
};
