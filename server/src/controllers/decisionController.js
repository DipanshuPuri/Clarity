const decisionService = require('../services/decisionService');

const create = async (req, res) => {
    try {
        const { title, chosenOption, rationale, rejectedAlternatives, tradeoffs, expectedOutcome, intentId, status } = req.body;
        if (!title || !chosenOption || !rationale || !rejectedAlternatives || !intentId) {
            return res.status(400).json({ error: 'Title, Chosen Option, Rationale, Rejected Alternatives, and IntentId are required' });
        }

        // authorId comes from authMiddleware
        const decision = await decisionService.createDecision(
            {
                title,
                chosenOption,
                rationale,
                rejectedAlternatives,
                tradeoffs,
                expectedOutcome,
                intentId,
                status
            },
            req.user.id // assuming token has id
        );
        res.status(201).json(decision);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const list = async (req, res) => {
    try {
        const { intentId } = req.query;
        const decisions = await decisionService.getDecisions({
            intentId,
            organizationId: req.user?.organizationId
        });
        res.json(decisions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const get = async (req, res) => {
    try {
        const decision = await decisionService.getDecisionById(req.params.id, req.user?.organizationId);
        if (!decision) return res.status(404).json({ error: 'Decision not found or access denied' });
        res.json(decision);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const decision = await decisionService.updateDecision(req.params.id, req.body);
        res.json(decision);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await decisionService.deleteDecision(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { create, list, get, update, remove };
