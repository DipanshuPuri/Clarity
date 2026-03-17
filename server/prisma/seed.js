const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const projectsData = [
    {
        name: "Mobile Platform Stability",
        budget: 180000,
        deadline: new Date("2026-08-10"),
        status: "Ongoing",
        priority: "High",
        team: "Alpha",
        problemStatement: "Critical infrastructure reinforcement for the Clarity mobile workstation suite.",
        successDefinition: "Zero downtime during peak hours.",
        createdAt: new Date("2024-01-15T08:00:00Z"),
    },
    {
        name: "AI Strategy Engine",
        budget: 450000,
        deadline: new Date("2026-12-15"),
        status: "Live",
        priority: "Critical",
        team: "Omega",
        problemStatement: "Deep-trace predictive logic for automated organizational memory extraction.",
        successDefinition: "Predictive accuracy > 85%.",
        createdAt: new Date("2024-01-10T10:00:00Z"),
    },
    {
        name: "Bureau Design System",
        budget: 95000,
        deadline: new Date("2026-05-20"),
        status: "Completed",
        priority: "Medium",
        team: "Beta",
        problemStatement: "The visual and interaction DNA of the Clarity ecosystem.",
        successDefinition: "100% component coverage.",
        createdAt: new Date("2023-11-20T09:00:00Z"),
    },
    {
        name: "Neural Data Pipeline",
        budget: 220000,
        deadline: new Date("2026-09-30"),
        status: "Starts Soon",
        priority: "High",
        team: "Gamma",
        problemStatement: "High-throughput data ingestion layer for real-time strategic monitoring.",
        successDefinition: "Latency < 50ms.",
        createdAt: new Date("2024-02-01T14:00:00Z")
    },
    {
        name: "Legacy Migration Loop",
        budget: 60000,
        deadline: new Date("2026-04-01"),
        status: "On Hold",
        priority: "Low",
        team: "Alpha",
        problemStatement: "Phasing out monolithic intent containers in favor of distributed trace logic.",
        successDefinition: "Legacy systems offline.",
        createdAt: new Date("2024-01-05T11:00:00Z"),
    },
    {
        name: "Quantum Audit Trail",
        budget: 310000,
        deadline: new Date("2027-01-15"),
        status: "Ongoing",
        priority: "High",
        team: "Omega",
        problemStatement: "Implementing sub-atomic visibility into strategic decision paths.",
        successDefinition: "Full auditability.",
        createdAt: new Date("2024-01-25T15:30:00Z")
    },
    {
        name: "Global Ops Gateway",
        budget: 125000,
        deadline: new Date("2026-06-30"),
        status: "Starts Soon",
        priority: "Medium",
        team: "Beta",
        problemStatement: "Centralizing disparate regional operational silos into one bureau node.",
        successDefinition: "Unified gateway.",
        createdAt: new Date("2024-02-10T12:00:00Z")
    },
    {
        name: "Identity Shield V2",
        budget: 85000,
        deadline: new Date("2026-11-20"),
        status: "Live",
        priority: "Critical",
        team: "Gamma",
        problemStatement: "Hardening the biometric authorization layer for co-owner level access.",
        successDefinition: "Zero breaches.",
        createdAt: new Date("2024-01-30T09:45:00Z")
    },
    {
        name: "Predictive Intent V3",
        budget: 520000,
        deadline: new Date("2027-05-10"),
        status: "Ongoing",
        priority: "High",
        team: "Alpha",
        problemStatement: "Advanced heuristics for anticipating strategic shifts before they manifest.",
        successDefinition: "Intent prediction accuracy > 90%.",
        createdAt: new Date("2024-02-05T16:20:00Z")
    },
    {
        name: "Zero-Latency Sync",
        budget: 140000,
        deadline: new Date("2026-03-15"),
        status: "On Hold",
        priority: "Medium",
        team: "Beta",
        problemStatement: "Optimizing the websocket propagation layer for instantaneous org-wide state updates.",
        successDefinition: "Sync time < 10ms.",
        createdAt: new Date("2024-01-20T10:10:00Z")
    },
    { name: "Project Delta", budget: 100000, deadline: new Date("2026-05-01"), status: "Ongoing", priority: "Low", team: "Beta", problemStatement: "Test project for Delta unit.", successDefinition: "Success.", createdAt: new Date("2024-02-15T10:00:00Z") },
    { name: "Project Epsilon", budget: 110000, deadline: new Date("2026-06-01"), status: "Ongoing", priority: "Medium", team: "Gamma", problemStatement: "Test project for Epsilon unit.", successDefinition: "Success.", createdAt: new Date("2024-02-15T11:00:00Z") },
    { name: "Project Zeta", budget: 120000, deadline: new Date("2026-07-01"), status: "Ongoing", priority: "High", team: "Omega", problemStatement: "Test project for Zeta unit.", successDefinition: "Success.", createdAt: new Date("2024-02-15T12:00:00Z") },
    { name: "Project Eta", budget: 130000, deadline: new Date("2026-08-01"), status: "Ongoing", priority: "Critical", team: "Alpha", problemStatement: "Test project for Eta unit.", successDefinition: "Success.", createdAt: new Date("2024-02-15T13:00:00Z") },
    { name: "Project Theta", budget: 140000, deadline: new Date("2026-09-01"), status: "Ongoing", priority: "Low", team: "Beta", problemStatement: "Test project for Theta unit.", successDefinition: "Success.", createdAt: new Date("2024-02-15T14:00:00Z") },
    { name: "Project Iota", budget: 150000, deadline: new Date("2026-10-01"), status: "Ongoing", priority: "Medium", team: "Gamma", problemStatement: "Test project for Iota unit.", successDefinition: "Success.", createdAt: new Date("2024-02-15T15:00:00Z") },
    { name: "Project Kappa", budget: 160000, deadline: new Date("2026-11-01"), status: "Ongoing", priority: "High", team: "Omega", problemStatement: "Test project for Kappa unit.", successDefinition: "Success.", createdAt: new Date("2024-02-15T16:00:00Z") }
];

const ticketTitles = [
    "Fix Schema Validation", "Implement API Rate Limiting", "Audit Security Protocols", "Update React Components",
    "Refactor Data Layer", "Explore GraphQL Integration", "Optimize Database Queries", "Sync User Preferences",
    "Design New Landing Page", "Containerize Application", "Setup CI/CD Pipeline", "Debug Memory Leak",
    "Write Unit Tests", "Update Documentation", "Review Pull Requests", "Deploy to Staging"
];

const ticketDescriptions = [
    "Detailed system intervention required to maintain strategic alignment with the operational directive.",
    "Optimize for high-throughput scenarios to ensure zero-latency execution.",
    "Refactor legacy code blocks to adhere to the new 'Clarity' design principles.",
    "Ensure all security headers are correctly propogated through the gateway."
];

async function main() {
    console.log('Start seeding ...');

    // 1. Clean up
    await prisma.workflowEdge.deleteMany();
    await prisma.workflowNode.deleteMany();
    await prisma.workflow.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();

    // 2. Create Organization
    const org = await prisma.organization.create({
        data: {
            name: 'Clarity Bureau',
            industry: 'Technology',
            size: 'Enterprise',
            description: 'Central Strategic Command'
        }
    });

    console.log(`Created organization: ${org.name}`);

    // 3. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const usersData = [
        { email: 'founder@clarity.com', firstName: 'Alexander', lastName: 'Pierce', role: 'FOUNDER' },
        { email: 'admin@clarity.com', firstName: 'Sarah', lastName: 'Connor', role: 'ADMIN' },
        { email: 'manager@clarity.com', firstName: 'Jason', lastName: 'Bourne', role: 'MANAGER' },
        { email: 'member@clarity.com', firstName: 'Elena', lastName: 'Fisher', role: 'MEMBER' },
        { email: 'intern@clarity.com', firstName: 'Peter', lastName: 'Parker', role: 'INTERN' },
    ];

    const users = [];
    for (const u of usersData) {
        const user = await prisma.user.create({
            data: {
                ...u,
                passwordHash: hashedPassword,
                organizationId: org.id
            }
        });
        users.push(user);
        console.log(`Created user: ${user.email} (${user.role})`);
    }

    // 4. Create Projects (Expanded to ~50 projects)
    const projects = [];
    const baseProjects = [...projectsData];

    // Helper to generate variations
    const teams = ['Alpha', 'Beta', 'Gamma', 'Omega', 'Delta', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
    const statuses = ['Live', 'Ongoing', 'Starts Soon', 'On Hold', 'Completed'];
    const priorities = ['Critical', 'High', 'Medium', 'Low'];

    for (let i = 0; i < 50; i++) {
        const base = baseProjects[i % baseProjects.length];
        const project = await prisma.project.create({
            data: {
                name: i < baseProjects.length ? base.name : `${base.name} (Instance ${Math.floor(i / baseProjects.length)})`,
                problemStatement: base.problemStatement,
                successDefinition: base.successDefinition,
                budget: (base.budget || 100000) + (Math.random() * 50000),
                deadline: new Date(Date.now() + Math.floor(Math.random() * 31536000000)), // up to 1 year from now
                status: statuses[Math.floor(Math.random() * statuses.length)],
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                team: teams[Math.floor(Math.random() * teams.length)],
                organizationId: org.id,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
            }
        });
        projects.push(project);
    }
    console.log(`Created ${projects.length} projects`);

    // 5. Create Tickets for each project (Long List)
    for (const project of projects) {
        const ticketCount = Math.floor(Math.random() * 20) + 15; // 15 to 35 tickets

        for (let i = 0; i < ticketCount; i++) {
            const assignee = users[Math.floor(Math.random() * users.length)];
            const creator = users[Math.floor(Math.random() * users.length)];

            await prisma.ticket.create({
                data: {
                    title: ticketTitles[Math.floor(Math.random() * ticketTitles.length)],
                    description: ticketDescriptions[Math.floor(Math.random() * ticketDescriptions.length)],
                    status: ["To Do", "In Progress", "Done"][Math.floor(Math.random() * 3)],
                    priority: ["Critical", "High", "Medium", "Low"][Math.floor(Math.random() * 4)],
                    type: "Task",
                    projectId: project.id,
                    assigneeId: assignee.id,
                    createdById: creator.id,
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)) // Random past date
                }
            });
        }
        console.log(`Created ${ticketCount} tickets for project ${project.name}`);
    }

    // 6. Create Standard Engineering Workflow for Project Iota (and defaults)
    const projectIota = projects.find(p => p.name === "Project Iota");
    if (projectIota) {
        const workflow = await prisma.workflow.create({
            data: {
                name: "Standard Engineering Flow",
                description: "The primary operational path for standard engineering tasks.",
                isDefault: true,
                projectId: projectIota.id
            }
        });

        const statusOpen = await prisma.workflowNode.create({
            data: { name: "Open", type: "START", color: "#cbd5e1", positionX: 0, positionY: 0, workflowId: workflow.id }
        });
        const statusInProgress = await prisma.workflowNode.create({
            data: { name: "In Progress", type: "ACTIVE", color: "#3b82f6", positionX: 250, positionY: 0, workflowId: workflow.id }
        });
        const statusReview = await prisma.workflowNode.create({
            data: { name: "Review", type: "ACTIVE", color: "#eab308", positionX: 500, positionY: 0, workflowId: workflow.id }
        });
        const statusDone = await prisma.workflowNode.create({
            data: { name: "Done", type: "END", color: "#22c55e", positionX: 750, positionY: 0, workflowId: workflow.id }
        });

        await prisma.workflowEdge.create({
            data: { name: "Start Development", workflowId: workflow.id, fromNodeId: statusOpen.id, toNodeId: statusInProgress.id }
        });
        await prisma.workflowEdge.create({
            data: { name: "Submit for Review", workflowId: workflow.id, fromNodeId: statusInProgress.id, toNodeId: statusReview.id }
        });
        await prisma.workflowEdge.create({
            data: { name: "Request Changes", workflowId: workflow.id, fromNodeId: statusReview.id, toNodeId: statusInProgress.id }
        });
        await prisma.workflowEdge.create({
            data: { name: "Approve & Complete", workflowId: workflow.id, fromNodeId: statusReview.id, toNodeId: statusDone.id }
        });

        console.log(`Created Workflow for project ${projectIota.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
