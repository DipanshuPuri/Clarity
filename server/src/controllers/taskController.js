const taskService = require('../services/taskService');

const create = async (req, res) => {
    try {
        const { title, executionDescription, expectedOutcome, intentId, decisionId } = req.body;

        if (!title || !executionDescription || !expectedOutcome || !intentId || !decisionId) {
            return res.status(400).json({ error: 'Missing required fields (Title, Execution Description, Expected Outcome, IntentId, DecisionId)' });
        }

        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const list = async (req, res) => {
    try {
        const { intentId, decisionId, assigneeId } = req.query;
        const tasks = await taskService.getTasks({
            intentId,
            decisionId,
            assigneeId,
            organizationId: req.user?.organizationId
        });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const get = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message }); // 400 for rule violations
    }
};

const remove = async (req, res) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { create, list, get, update, remove };
