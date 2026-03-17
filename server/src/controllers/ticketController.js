const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { recalculateForTicket } = require('../utils/releaseHelpers');

const create = async (req, res) => {
    try {
        const { title, description, status, priority, type, projectId, assigneeId } = req.body;

        if (!title || !projectId) {
            return res.status(400).json({ error: 'Title and Project ID are required' });
        }

        const ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                status: status || 'To Do',
                priority: priority || 'Medium',
                type: type || 'Task',
                projectId,
                assigneeId,
                createdById: req.user.id
            },
            include: {
                assignee: true,
                createdBy: true
            }
        });

        res.status(201).json(ticket);

        // Asynchronously recalculate affected releases
        recalculateForTicket(ticket.id, ticket.projectId).catch(console.error);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };

        let newHandoff = null;
        if (data.status && data.handoffToRole) {
            newHandoff = {
                ticketId: id,
                fromRole: req.user.department || req.user.role || 'System',
                toRole: data.handoffToRole
            };
            delete data.handoffToRole;
        }

        const ticket = await prisma.ticket.update({
            where: { id },
            data,
            include: {
                assignee: true,
                createdBy: true
            }
        });

        res.json(ticket);

        if (newHandoff) {
            await prisma.handoff.create({ data: newHandoff });
        }

        if (data.status) {
            // Asynchronously recalculate affected releases
            recalculateForTicket(ticket.id, ticket.projectId).catch(console.error);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: req.params.id },
            select: { projectId: true }
        });
        await prisma.ticket.delete({
            where: { id: req.params.id }
        });
        res.status(204).send();

        if (ticket && ticket.projectId) {
            recalculateForTicket(req.params.id, ticket.projectId).catch(console.error);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: req.params.id },
            include: {
                assignee: true,
                createdBy: true
            }
        });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const acceptHandoff = async (req, res) => {
    try {
        const { id } = req.params;
        const handoff = await prisma.handoff.findFirst({
            where: { ticketId: id, acceptedAt: null },
            orderBy: { createdAt: 'desc' }
        });

        if (!handoff) return res.status(404).json({ error: 'No pending handoff found.' });

        const pendingDurationMinutes = Math.round((new Date() - handoff.createdAt) / 60000);

        const updated = await prisma.handoff.update({
            where: { id: handoff.id },
            data: { acceptedAt: new Date(), pendingDuration: pendingDurationMinutes }
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { create, update, remove, getById, acceptHandoff };
