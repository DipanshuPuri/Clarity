/**
 * projectRoutes.js - Project API Routes
 * 
 * RBAC ENFORCEMENT:
 * 
 * | Endpoint       | Method | Auth Required | Role Required |
 * |----------------|--------|---------------|---------------|
 * | /api/projects  | GET    | Yes           | Any           |
 * | /api/projects  | POST   | Yes           | MANAGER       |
 * | /api/projects/:id | GET | Yes           | Any           |
 * 
 * Middleware Chain:
 * - authenticate: Verifies JWT from cookie, attaches user to req
 * - authorize('MANAGER'): Checks req.user.role === 'MANAGER'
 * 
 * If MEMBER tries POST /api/projects -> 403 Forbidden
 */
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { checkProjectFreeze } = require('../middlewares/freezeGuard');

// Public/Protected Routes (Authenticated Users)
router.get('/', authenticate, projectController.list);
router.get('/:id', authenticate, projectController.get);

// Manager Only Routes (Creation)
router.post('/', authenticate, authorize('MANAGER'), projectController.create);

// Update/Delete 
router.put('/:id', authenticate, authorize('MANAGER'), checkProjectFreeze, projectController.update);
router.delete('/:id', authenticate, authorize('MANAGER'), checkProjectFreeze, projectController.remove);

// Member Assignments
router.post('/:id/members', authenticate, authorize('MANAGER'), projectController.assignMember);

module.exports = router;
