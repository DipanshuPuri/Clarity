const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @route   GET /api/users
 * @desc    Get all users in organization
 * @access  Private
 */
router.get('/', authenticate, userController.listAll);

module.exports = router;
