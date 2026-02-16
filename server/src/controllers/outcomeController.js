const outcomeService = require('../services/outcomeService');

const create = async (req, res) => {
    try {
        const { taskId, result, notes, learning } = req.body;

        if (!taskId || !result || !notes || !learning) {
            return res.status(400).json({ error: 'TaskId, Result (SUCCESS/PARTIAL/FAILED), Notes, and Learning reflection are required' });
        }

        const outcome = await outcomeService.createOutcome({ taskId, result, notes, learning });
        res.status(201).json(outcome);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getByTask = async (req, res) => {
    try {
        const outcome = await outcomeService.getOutcomeByTaskId(req.params.taskId);
        if (!outcome) return res.status(404).json({ error: 'Outcome not found' });
        res.json(outcome);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { create, getByTask };
