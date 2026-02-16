const express = require('express');
const router = express.Router();
const intentController = require('../controllers/intentController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', authenticate, intentController.list);
router.get('/:id', authenticate, intentController.get);

// Intent Creation is for MANAGERS (Strategy)
router.post('/', authenticate, authorize('MANAGER'), intentController.create);
router.put('/:id', authenticate, authorize('MANAGER'), intentController.update);

module.exports = router;
