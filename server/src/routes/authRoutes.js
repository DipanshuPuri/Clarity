/**
 * authRoutes.js
 * ----------------
 * This file defines all authentication-related routes.
 * It ONLY handles routing.
 *
 * Business logic lives in:
 *   controllers/authController.js
 *
 * Security logic (JWT verification) lives in:
 *   middlewares/authMiddleware.js
 */

const express = require('express');
const router = express.Router();

// =======================
// Controllers
// =======================
// The controller contains the actual logic for each route
const authController = require('../controllers/authController');

// =======================
// Middleware
// =======================
// authenticate middleware verifies JWT and attaches user to request
const { authenticate } = require('../middlewares/authMiddleware');

// =======================
// AUTH ROUTES
// =======================

/**
 * @route   POST /auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', authController.signup);

/**
 * @route   POST /auth/login
 * @desc    Login user and issue JWT
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /auth/logout
 * @desc    Logout user (clears cookie / token)
 * @access  Private
 */
router.post('/logout', authController.logout);

/**
 * @route   GET /auth/me
 * @desc    Get currently logged-in user's profile
 * @access  Private (JWT required)
 */
router.get('/me', authenticate, authController.me);

// =======================
// EXPORT ROUTER
// =======================
module.exports = router;
