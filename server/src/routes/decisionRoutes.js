const express = require('express');
const router = express.Router();
const decisionController = require('../controllers/decisionController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Public/Member Routes
router.get('/', authenticate, decisionController.list);
router.get('/:id', authenticate, decisionController.get);

// Manager Routes (Critical Scope)
router.post('/', authenticate, authorize('MANAGER'), decisionController.create);
router.put('/:id', authenticate, authorize('MANAGER'), decisionController.update);
router.delete('/:id', authenticate, authorize('MANAGER'), decisionController.remove);

module.exports = router;
