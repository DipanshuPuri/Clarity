const { PrismaClient } = require('@prisma/client');
const dagre = require('dagre');

const prisma = new PrismaClient();

const generateDagreLayout = (nodes, edges) => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'LR', nodesep: 150, ranksep: 220 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach(node => {
        g.setNode(node.id, { width: 300, height: 120 });
    });

    edges.forEach(edge => {
        g.setEdge(edge.fromNodeId, edge.toNodeId);
    });

    dagre.layout(g);

    return nodes.map(node => {
        const n = g.node(node.id);
        return {
            ...node,
            positionX: n.x,
            positionY: n.y
        };
    });
};

const LOREM = "Comprehensive organizational methodology aligning strategic checkpoints with automated verification gates to ensure uncompromised standard delivery.";

const getRandomUsers = (users, count) => {
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const getSampleData = (users) => {
    const ts = (d) => `2026-03-${String(d).padStart(2,'0')}T${10+Math.floor(Math.random()*8)}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}:00Z`;
    return {
        owners: getRandomUsers(users, Math.floor(Math.random() * 4) + 2).map(u => `${u.firstName} ${u.lastName}`),
        history: Array(Math.floor(Math.random() * 5) + 1).fill(0).map((_, i) => ({
            date: ts(Math.floor(Math.random() * 10) + 1),
            author: getRandomUsers(users, 1)[0].firstName,
            description: i === 0 ? "Created node representation." : "Adjusted execution parameters."
        })),
        executionNotes: [ "Verify dependencies.", "Validate compliance requirements.", "Execute pre-flight checks." ],
        discussions: Array(Math.floor(Math.random() * 5) + 1).fill(0).map((_, i) => ({
            author: getRandomUsers(users, 1)[0].firstName,
            content: "We need more integration coverage before sign-off on this phase.",
            timestamp: ts(10 + i)
        }))
    };
};

const createStructure = (projectId, type, users) => {
    let nodesRaw = []; let edgesRaw = [];
    const rndId = () => `ev_${Math.random().toString(36).substr(2, 9)}`;

    let wfName = "";
    let wfDesc = "";

    if (type === 'binary') {
        wfName = "Binary Decision Tree";
        wfDesc = "Strict evaluation paths forcing a definitive yes/no binary flow.";
        const root = rndId(); const l1 = rndId(); const r1 = rndId(); const ll2 = rndId(); const lr2 = rndId(); const rl2 = rndId(); const rr2 = rndId();
        nodesRaw = [
            { id: root, name: "Start Evaluation", type: 'START', color: '#cbd5e1' },
            { id: l1, name: "Route Alpha", type: 'ACTIVE', color: '#3b82f6' },
            { id: r1, name: "Route Beta", type: 'ACTIVE', color: '#3b82f6' },
            { id: ll2, name: "Sub-Alpha 1", type: 'END', color: '#22c55e' },
            { id: lr2, name: "Sub-Alpha 2", type: 'END', color: '#ef4444' },
            { id: rl2, name: "Sub-Beta 1", type: 'END', color: '#22c55e' },
            { id: rr2, name: "Sub-Beta 2", type: 'END', color: '#ef4444' },
        ];
        edgesRaw = [
            { id: rndId(), name: "Condition A", fromNodeId: root, toNodeId: l1 },
            { id: rndId(), name: "Condition B", fromNodeId: root, toNodeId: r1 },
            { id: rndId(), name: "Pass", fromNodeId: l1, toNodeId: ll2 },
            { id: rndId(), name: "Fail", fromNodeId: l1, toNodeId: lr2 },
            { id: rndId(), name: "Pass", fromNodeId: r1, toNodeId: rl2 },
            { id: rndId(), name: "Fail", fromNodeId: r1, toNodeId: rr2 },
        ];
    } else if (type === 'circular') {
        wfName = "Continuous Lifecycle";
        wfDesc = "Iterative monitoring loop for persistent environment patching.";
        const [n1, n2, n3, n4, n5] = [rndId(), rndId(), rndId(), rndId(), rndId()];
        nodesRaw = [
            { id: n1, name: "Plan Phase", type: 'START', color: '#cbd5e1' },
            { id: n2, name: "Execute Phase", type: 'ACTIVE', color: '#3b82f6' },
            { id: n3, name: "Monitor Phase", type: 'ACTIVE', color: '#eab308' },
            { id: n4, name: "Analyze Phase", type: 'ACTIVE', color: '#8b5cf6' },
            { id: n5, name: "Feedback Synthesis", type: 'END', color: '#22c55e' }
        ];
        edgesRaw = [
            { id: rndId(), name: "Proceed", fromNodeId: n1, toNodeId: n2 },
            { id: rndId(), name: "Proceed", fromNodeId: n2, toNodeId: n3 },
            { id: rndId(), name: "Proceed", fromNodeId: n3, toNodeId: n4 },
            { id: rndId(), name: "Synthesize", fromNodeId: n4, toNodeId: n5 },
            { id: rndId(), name: "Loop Back (Auto)", fromNodeId: n5, toNodeId: n1 },
        ];
    } else if (type === 'diagonal') {
        wfName = "Diagonal Pipelining";
        wfDesc = "Phased cascading setup across multiple isolated team tiers.";
        const [n1, n2, n3, n4, n5] = [rndId(), rndId(), rndId(), rndId(), rndId()];
        nodesRaw = [
            { id: n1, name: "Initial Sync", type: 'START', color: '#cbd5e1' },
            { id: n2, name: "Config Layer", type: 'ACTIVE', color: '#14b8a6' },
            { id: n3, name: "Integration Box", type: 'ACTIVE', color: '#3b82f6' },
            { id: n4, name: "Compliance Check", type: 'ACTIVE', color: '#eab308' },
            { id: n5, name: "Live Rollout", type: 'END', color: '#22c55e' }
        ];
        edgesRaw = [
            { id: rndId(), name: "Handoff", fromNodeId: n1, toNodeId: n2 },
            { id: rndId(), name: "Handoff", fromNodeId: n2, toNodeId: n3 },
            { id: rndId(), name: "Handoff", fromNodeId: n3, toNodeId: n4 },
            { id: rndId(), name: "Launch", fromNodeId: n4, toNodeId: n5 },
        ];
    } else if (type === 'dag') {
        wfName = "Branching Operational DAG";
        wfDesc = "Parallel track coordination syncing upstream branches into a single gateway point.";
        const [n1, b1, b2, b3, sync, deploy] = [rndId(), rndId(), rndId(), rndId(), rndId(), rndId()];
        nodesRaw = [
            { id: n1, name: "Initiate Ops", type: 'START', color: '#cbd5e1' },
            { id: b1, name: "Security Track", type: 'ACTIVE', color: '#ef4444' },
            { id: b2, name: "Performance Track", type: 'ACTIVE', color: '#14b8a6' },
            { id: b3, name: "Compliance Track", type: 'ACTIVE', color: '#8b5cf6' },
            { id: sync, name: "Consolidation Sync", type: 'ACTIVE', color: '#eab308' },
            { id: deploy, name: "Target Achieved", type: 'END', color: '#22c55e' }
        ];
        edgesRaw = [
            { id: rndId(), name: "Trigger Sec", fromNodeId: n1, toNodeId: b1 },
            { id: rndId(), name: "Trigger Perf", fromNodeId: n1, toNodeId: b2 },
            { id: rndId(), name: "Trigger Comp", fromNodeId: n1, toNodeId: b3 },
            { id: rndId(), name: "Passed", fromNodeId: b1, toNodeId: sync },
            { id: rndId(), name: "Passed", fromNodeId: b2, toNodeId: sync },
            { id: rndId(), name: "Passed", fromNodeId: b3, toNodeId: sync },
            { id: rndId(), name: "Finalize", fromNodeId: sync, toNodeId: deploy },
        ];
    } else {
        wfName = "Layered Architecture";
        wfDesc = "Vertical slicing framework demonstrating hierarchical authority limits.";
        const [l1, l2, l3, l4] = [rndId(), rndId(), rndId(), rndId()];
        nodesRaw = [
            { id: l1, name: "Frontend Cluster", type: 'START', color: '#f97316' },
            { id: l2, name: "API Gateway", type: 'ACTIVE', color: '#0ea5e9' },
            { id: l3, name: "Service Fabric", type: 'ACTIVE', color: '#6366f1' },
            { id: l4, name: "Database Shards", type: 'END', color: '#14b8a6' }
        ];
        edgesRaw = [
            { id: rndId(), name: "Consumes", fromNodeId: l1, toNodeId: l2 },
            { id: rndId(), name: "Routes To", fromNodeId: l2, toNodeId: l3 },
            { id: rndId(), name: "Persists At", fromNodeId: l3, toNodeId: l4 },
        ];
    }

    nodesRaw = nodesRaw.map(n => ({ ...n, description: `${LOREM} Targeting ${n.name}.`, ...getSampleData(users) }));
    const laidOutNodes = generateDagreLayout(nodesRaw, edgesRaw);

    return { name: wfName, description: wfDesc, nodes: laidOutNodes, edges: edgesRaw };
};

async function backfill() {
    console.log("Starting backfill migration...");
    const users = await prisma.user.findMany();
    if (users.length === 0) { console.log("No users found. Aborting."); return; }

    const projects = await prisma.project.findMany({ include: { workflows: true } });
    console.log(`Found ${projects.length} projects.`);

    const structures = ['binary', 'circular', 'diagonal', 'dag', 'layered'];

    let addedWorkflowsCount = 0;
    let upgradedNodesCount = 0;

    for (const project of projects) {
        const wfCount = project.workflows.length;
        const targetWfCount = Math.floor(Math.random() * 4) + 2; // 2 to 5 workflows per project
        const toGenerate = targetWfCount - wfCount;

        // Upgrade existing workflows to ensure they have owners, descriptions, and dagre layouts
        for (const wf of project.workflows) {
            const nodes = await prisma.workflowNode.findMany({ where: { workflowId: wf.id } });
            const edges = await prisma.workflowEdge.findMany({ where: { workflowId: wf.id } });
            
            // Re-layout and populate fields
            const nodesWithMockData = nodes.map(n => ({
                ...n,
                description: n.description || `Autogenerated description for ${n.name}. Resolving data deadlock.`,
                ...(n.owners && Array.isArray(n.owners) && n.owners.length > 0 ? {
                    owners: n.owners, history: n.history, executionNotes: n.executionNotes, discussions: n.discussions
                } : getSampleData(users))
            }));
            
            const laidOutNodes = generateDagreLayout(nodesWithMockData, edges);

            // Save layouts and backfills
            for (const dn of laidOutNodes) {
                await prisma.workflowNode.update({
                    where: { id: dn.id },
                    data: {
                        positionX: dn.positionX, positionY: dn.positionY,
                        description: dn.description, owners: dn.owners, history: dn.history,
                        executionNotes: dn.executionNotes, discussions: dn.discussions
                    }
                });
                upgradedNodesCount++;
            }
        }

        if (toGenerate > 0) {
            const randomlySelectedStructures = [...structures].sort(() => 0.5 - Math.random()).slice(0, toGenerate);
            
            for (const struct of randomlySelectedStructures) {
                const scaffold = createStructure(project.id, struct, users);

                const createdWf = await prisma.workflow.create({
                    data: { name: scaffold.name, description: scaffold.description, projectId: project.id }
                });

                const idMap = {};
                for (const n of scaffold.nodes) {
                    const cNode = await prisma.workflowNode.create({
                        data: {
                            name: n.name, type: n.type, color: n.color, positionX: n.positionX, positionY: n.positionY,
                            description: n.description, owners: n.owners, history: n.history,
                            executionNotes: n.executionNotes, discussions: n.discussions,
                            workflowId: createdWf.id
                        }
                    });
                    idMap[n.id] = cNode.id;
                }

                if (scaffold.edges.length > 0) {
                    await prisma.workflowEdge.createMany({
                        data: scaffold.edges.map(e => ({
                            name: e.name || "Transition",
                            fromNodeId: idMap[e.fromNodeId],
                            toNodeId: idMap[e.toNodeId],
                            workflowId: createdWf.id
                        }))
                    });
                }
                addedWorkflowsCount++;
            }
        }
    }

    console.log(`Backfill Complete. Upgraded ${upgradedNodesCount} existing nodes.`);
    console.log(`Generated ${addedWorkflowsCount} new unique structure combinations with pristine mock data.`);
}

backfill().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
