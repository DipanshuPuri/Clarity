const express = require('express');
const router = express.Router();
const outcomeController = require('../controllers/outcomeController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Creating an outcome is the only way to finish a task
// We allow MEMBERS to do this (Engineers validate their own work generally, or Manager)
router.post('/', authenticate, outcomeController.create);

router.get('/task/:taskId', authenticate, outcomeController.getByTask);

module.exports = router;
