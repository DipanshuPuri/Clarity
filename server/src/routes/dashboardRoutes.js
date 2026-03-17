const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate, dashboardController.getDashboardData);
router.get('/active-decisions', authenticate, dashboardController.getActiveDecisions);
router.get('/reflection-required', authenticate, dashboardController.getReflectionRequired);
router.get('/recent-learnings', authenticate, dashboardController.getRecentLearnings);
router.get('/onboarding-status', authenticate, dashboardController.getOnboardingStatus);

module.exports = router;
