const projectService = require('../services/projectService');

const create = async (req, res) => {
    try {
        // RBAC: Only MANAGER, ADMIN, FOUNDER can create projects
        if (!['MANAGER', 'ADMIN', 'FOUNDER'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions to create projects.' });
        }

        const { name, problemStatement, successDefinition, budget, deadline, status, priority, team } = req.body;
        if (!name || !problemStatement || !successDefinition) {
            return res.status(400).json({ error: 'Name, Problem Statement, and Success Definition are required' });
        }

        const project = await projectService.createProject({
            name,
            problemStatement,
            successDefinition,
            budget,
            deadline,
            status,
            priority,
            team,
            organizationId: req.user?.organizationId
        });
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const project = await projectService.getProjectById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        if (!['MANAGER', 'ADMIN', 'FOUNDER'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions to update projects.' });
        }
        const project = await projectService.updateProject(req.params.id, req.body);
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await projectService.deleteProject(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const list = async (req, res) => {
    try {
        const projects = await projectService.getAllProjects(req.user?.organizationId);
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const assignMember = async (req, res) => {
    try {
        if (!['MANAGER', 'ADMIN', 'FOUNDER'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions to assign members.' });
        }
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        const project = await projectService.addMember(req.params.id, userId);
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { create, list, get: getById, update, remove, assignMember };
