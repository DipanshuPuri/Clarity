const express = require('express');
const router = express.Router();
const releaseController = require('../controllers/releaseController');
const { authenticate: authMiddleware } = require('../middlewares/authMiddleware');
const { checkReleaseScopeFreeze } = require('../middlewares/freezeGuard');

router.use(authMiddleware);

router.post('/', releaseController.createRelease);
router.get('/', releaseController.getReleases);
router.get('/:id', releaseController.getReleaseById);
router.get('/:id/risks', releaseController.getReleaseRisks);
router.get('/:id/simulate', releaseController.simulateFreeze);

router.patch('/:id/status', releaseController.updateReleaseStatus);
router.put('/:id', checkReleaseScopeFreeze, releaseController.updateRelease);

router.post('/:id/projects', checkReleaseScopeFreeze, releaseController.linkProjectToRelease);
router.post('/:id/tickets', checkReleaseScopeFreeze, releaseController.linkTicketToRelease);
router.patch('/:id/checklists/:checklistId/toggle', checkReleaseScopeFreeze, releaseController.toggleChecklist);
router.post('/:id/deploy', checkReleaseScopeFreeze, releaseController.deployRelease);
router.post('/:id/rollback', checkReleaseScopeFreeze, releaseController.rollbackDeployment);
router.delete('/:id', releaseController.deleteRelease);

module.exports = router;
