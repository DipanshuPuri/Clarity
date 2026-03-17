const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticate } = require('../middlewares/authMiddleware');
const { checkTicketFreeze } = require('../middlewares/freezeGuard');

router.use(authenticate);

router.post('/', ticketController.create);
router.put('/:id', checkTicketFreeze, ticketController.update);
router.delete('/:id', checkTicketFreeze, ticketController.remove);
router.get('/:id', ticketController.getById);

router.post('/:id/handoff/accept', checkTicketFreeze, ticketController.acceptHandoff);

module.exports = router;
