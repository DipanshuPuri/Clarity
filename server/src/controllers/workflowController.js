const prisma = require('../utils/prismaClient');

const create = async (req, res) => {
    try {
        const { name, description, projectId, nodes, edges } = req.body;

        if (!name || !projectId) {
            return res.status(400).json({ error: 'Name and Project ID are required' });
        }

        // If nodes/edges are provided, create them instead of defaults
        // Prisma's nested create for edges requires connecting to nodes that don't exist yet if done in one shot,
        // so we use a transaction or just create the workflow, then nodes, then edges mappings.
        // Actually, we can just do what update does inside a transaction.
        const createdWorkflow = await prisma.$transaction(async (tx) => {
            const workflow = await tx.workflow.create({
                data: {
                    name,
                    description,
                    projectId
                }
            });

            if (nodes && nodes.length > 0) {
                // Map old node IDs to newly generated ids to preserve edge relationships
                const oldToNewMap = {};
                for (const n of nodes) {
                    const createdNode = await tx.workflowNode.create({
                        data: {
                            name: n.name,
                            type: n.type || 'ACTIVE',
                            color: n.color,
                            positionX: n.positionX || 0,
                            positionY: n.positionY || 0,
                            description: n.description || null,
                            owners: n.owners || null,
                            history: n.history || null,
                            executionNotes: n.executionNotes || null,
                            discussions: n.discussions || null,
                            workflowId: workflow.id
                        }
                    });
                    oldToNewMap[n.id] = createdNode.id; // Map frontend/old ID to new Prisma ID
                }

                // Create edges using mapped IDs
                if (edges && edges.length > 0) {
                    await tx.workflowEdge.createMany({
                        data: edges.map(e => ({
                            name: e.name || 'Transition',
                            fromNodeId: oldToNewMap[e.fromNodeId] || e.fromNodeId, // fallback just in case
                            toNodeId: oldToNewMap[e.toNodeId] || e.toNodeId,
                            workflowId: workflow.id
                        }))
                    });
                }
            } else {
                // Default Nodes & Edges
                const start = await tx.workflowNode.create({
                    data: { name: 'To Do', type: 'START', positionX: 100, positionY: 100, color: '#64748b', workflowId: workflow.id }
                });
                const active = await tx.workflowNode.create({
                    data: { name: 'In Progress', type: 'ACTIVE', positionX: 400, positionY: 100, color: '#3b82f6', workflowId: workflow.id }
                });
                const end = await tx.workflowNode.create({
                    data: { name: 'Done', type: 'END', positionX: 700, positionY: 100, color: '#22c55e', workflowId: workflow.id }
                });
                await tx.workflowEdge.createMany({
                    data: [
                        { name: "Start Work", fromNodeId: start.id, toNodeId: active.id, workflowId: workflow.id },
                        { name: "Complete Work", fromNodeId: active.id, toNodeId: end.id, workflowId: workflow.id }
                    ]
                });
            }

            return tx.workflow.findUnique({
                where: { id: workflow.id },
                include: { nodes: true, edges: true }
            });
        });
        res.status(201).json(createdWorkflow);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const workflows = await prisma.workflow.findMany({
            where: { projectId },
            include: {
                nodes: true,
                edges: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(workflows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const workflow = await prisma.workflow.findUnique({
            where: { id },
            include: {
                nodes: true,
                edges: true
            }
        });

        if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

        res.json(workflow);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isDefault, nodes, edges } = req.body;

        // Verify workflow exists
        const existing = await prisma.workflow.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Workflow not found' });

        // Update workflow in a transaction to replace nodes and edges
        const updatedWorkflow = await prisma.$transaction(async (tx) => {
            // Update base details
            await tx.workflow.update({
                where: { id },
                data: { name, description, isDefault }
            });

            // Delete existing edges and nodes
            await tx.workflowEdge.deleteMany({ where: { workflowId: id } });
            await tx.workflowNode.deleteMany({ where: { workflowId: id } });

            // Create new nodes and build ID mapping for temp IDs
            const idMap = {}; // maps old temp frontendId -> new DB id
            if (nodes && nodes.length > 0) {
                for (const n of nodes) {
                    const validTypes = ['START', 'ACTIVE', 'Here', 'END', 'PAUSED'];
                    const isTemp = !n.id; // frontend sends undefined for new (temp) nodes
                    const created = await tx.workflowNode.create({
                        data: {
                            ...(n.id ? { id: n.id } : {}),
                            name: n.name,
                            type: validTypes.includes(n.type) ? n.type : 'ACTIVE',
                            color: n.color,
                            positionX: n.positionX || 0,
                            positionY: n.positionY || 0,
                            description: n.description || null,
                            owners: n.owners || null,
                            history: n.history || null,
                            executionNotes: n.executionNotes || null,
                            discussions: n.discussions || null,
                            workflowId: id
                        }
                    });
                    // If the frontend sent a tempId alongside (via frontendId field), map it
                    if (n.frontendId) {
                        idMap[n.frontendId] = created.id;
                    }
                }
            }

            // Create new edges, remapping any temp node IDs
            if (edges && edges.length > 0) {
                await tx.workflowEdge.createMany({
                    data: edges.map(e => ({
                        ...(e.id ? { id: e.id } : {}),
                        name: e.name || 'Transition',
                        fromNodeId: idMap[e.fromNodeId] || e.fromNodeId,
                        toNodeId: idMap[e.toNodeId] || e.toNodeId,
                        workflowId: id
                    }))
                });
            }

            return tx.workflow.findUnique({
                where: { id },
                include: { nodes: true, edges: true }
            });
        });

        res.json(updatedWorkflow);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteWorkflow = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify if workflow exists
        const workflow = await prisma.workflow.findUnique({
            where: { id }
        });

        if (!workflow) {
            return res.status(404).json({ error: 'Workflow not found.' });
        }

        // Delete the workflow
        // Because of onDelete: Cascade in Prisma schema, this will also delete associated nodes and edges
        await prisma.workflow.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { create, getByProject, getById, update, deleteWorkflow };
