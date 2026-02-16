const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate, taskController.list);
router.get('/:id', authenticate, taskController.get);
router.post('/', authenticate, taskController.create);
router.put('/:id', authenticate, taskController.update);
router.delete('/:id', authenticate, taskController.remove);

module.exports = router;
