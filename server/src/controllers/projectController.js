const projectService = require('../services/projectService');

const create = async (req, res) => {
    try {
        const { name, problemStatement, successDefinition } = req.body;
        if (!name || !problemStatement || !successDefinition) {
            return res.status(400).json({ error: 'Name, Problem Statement, and Success Definition are required' });
        }

        const project = await projectService.createProject({
            name,
            problemStatement,
            successDefinition
        });
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const list = async (req, res) => {
    try {
        const projects = await projectService.getAllProjects();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const get = async (req, res) => {
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

module.exports = { create, list, get, update, remove };
