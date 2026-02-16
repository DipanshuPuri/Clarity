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

// Public/Protected Routes (Authenticated Users)
router.get('/', authenticate, projectController.list);
router.get('/:id', authenticate, projectController.get);

// Manager Only Routes (Creation)
router.post('/', authenticate, authorize('MANAGER'), projectController.create);

// Update/Delete (Future Scope - Placeholders or commented out to follow strict instructions "DO NOT implement update/delete")
// router.put('/:id', authenticate, authorize('MANAGER'), projectController.update);
// router.delete('/:id', authenticate, authorize('MANAGER'), projectController.remove);

module.exports = router;
