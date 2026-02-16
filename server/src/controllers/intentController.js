const intentService = require('../services/intentService');

const create = async (req, res) => {
    try {
        const { title, assumption, successSignal, projectId } = req.body;
        if (!title || !assumption || !successSignal || !projectId) {
            return res.status(400).json({ error: 'Title, Assumption, Success Signal, and ProjectId are required' });
        }

        const intent = await intentService.createIntent({ title, assumption, successSignal, projectId });
        res.status(201).json(intent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const list = async (req, res) => {
    try {
        const { projectId } = req.query;
        const intents = await intentService.getIntents({ projectId });
        res.json(intents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const get = async (req, res) => {
    try {
        const intent = await intentService.getIntentById(req.params.id);
        if (!intent) return res.status(404).json({ error: 'Intent not found' });
        res.json(intent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const intent = await intentService.updateIntent(req.params.id, req.body);
        res.json(intent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { create, list, get, update };
