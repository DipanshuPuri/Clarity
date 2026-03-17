const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const { authenticate } = require('../middlewares/authMiddleware');

// All routes are prefixed with /api/workflows
router.post('/', authenticate, workflowController.create);
router.get('/project/:projectId', authenticate, workflowController.getByProject);
router.get('/:id', authenticate, workflowController.getById);
router.put('/:id', authenticate, workflowController.update);
router.delete('/:id', authenticate, workflowController.deleteWorkflow);

module.exports = router;
