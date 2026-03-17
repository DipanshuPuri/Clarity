const prisma = require('../utils/prismaClient');
const bcrypt = require('bcrypt');

const projectsData = [
    {
        name: "Mobile Platform Stability",
        budget: 180000,
        deadline: new Date("2026-08-10"),
        status: "Ongoing",
        priority: "High",
        team: "Alpha",
        problemStatement: "Critical infrastructure reinforcement for the Clarity mobile workstation suite.",
        successDefinition: "Zero downtime during peak hours."
    },
    {
        name: "AI Strategy Engine",
        budget: 450000,
        deadline: new Date("2026-12-15"),
        status: "Live",
        priority: "Critical",
        team: "Omega",
        problemStatement: "Deep-trace predictive logic for automated organizational memory extraction.",
        successDefinition: "Predictive accuracy > 85%."
    },
    {
        name: "Bureau Design System",
        budget: 95000,
        deadline: new Date("2026-05-20"),
        status: "Completed",
        priority: "Medium",
        team: "Beta",
        problemStatement: "The visual and interaction DNA of the Clarity ecosystem.",
        successDefinition: "100% component coverage."
    },
    { name: "Project Delta", budget: 100000, deadline: new Date("2026-05-01"), status: "Ongoing", priority: "Low", team: "Beta", problemStatement: "Test project for Delta unit.", successDefinition: "Success." },
    { name: "Project Epsilon", budget: 110000, deadline: new Date("2026-06-01"), status: "Ongoing", priority: "Medium", team: "Gamma", problemStatement: "Test project for Epsilon unit.", successDefinition: "Success." },
    {
        name: "Quantum Security Protocol",
        budget: 520000,
        deadline: new Date("2026-10-31"),
        status: "Ongoing",
        priority: "Critical",
        team: "Alpha",
        problemStatement: "Post-quantum cryptographic defenses for the Bureau's core data vault.",
        successDefinition: "Complete audit zero-day resistance."
    },
    {
        name: "Legacy Subsystems Retirement",
        budget: 45000,
        deadline: new Date("2026-04-15"),
        status: "Completed",
        priority: "Low",
        team: "Gamma",
        problemStatement: "Decommissioning sunset architectures to reduce technical debt footprint.",
        successDefinition: "Zero operational impact from legacy drops."
    },
    { name: "Global Latency Mesh", budget: 285000, deadline: new Date("2026-09-01"), status: "Ongoing", priority: "High", team: "Omega", problemStatement: "Distributed node optimization to drop baseline response time under 50ms.", successDefinition: "Sub 50ms ping globally." },
    { name: "Project Zeta", budget: 140000, deadline: new Date("2026-07-01"), status: "Ongoing", priority: "Medium", team: "Beta", problemStatement: "Expanding user analytics pipeline.", successDefinition: "Data tracking live." },
    { name: "Project Theta", budget: 120000, deadline: new Date("2026-11-20"), status: "Live", priority: "High", team: "Gamma", problemStatement: "Enhancing AI response accuracy metrics.", successDefinition: "Model precision over 92%." },
    { name: "Dark Harbor Protocol", budget: 350000, deadline: new Date("2026-06-30"), status: "Ongoing", priority: "Critical", team: "Alpha", problemStatement: "Fortification of internal routing infrastructure.", successDefinition: "Zero internal node leaks." },
    { name: "Operation Sunburst", budget: 75000, deadline: new Date("2027-01-15"), status: "Upcoming", priority: "Medium", team: "Sigma", problemStatement: "Rebranding the internal identity portal.", successDefinition: "Seamless migration of 100% auth instances." },
    { name: "Project Orion", budget: 500000, deadline: new Date("2026-03-10"), status: "Completed", priority: "High", team: "Omega", problemStatement: "Initial rollout of the Clarity V1 kernel.", successDefinition: "Core stabilization." },
    { name: "Project Chimera", budget: 220000, deadline: new Date("2026-08-01"), status: "Ongoing", priority: "Critical", team: "Beta", problemStatement: "Merging cross-functional data silos into a unified stream.", successDefinition: "Data continuity confirmed." },
    { name: "Neural Network Expansion", budget: 850000, deadline: new Date("2026-12-01"), status: "Ongoing", priority: "Critical", team: "Alpha", problemStatement: "Scaling up ML server capacities.", successDefinition: "Handles 1M requests/sec." },
    { name: "Employee Wellbeing Tracking", budget: 40000, deadline: new Date("2026-04-01"), status: "Live", priority: "Low", team: "Gamma", problemStatement: "Simple dashboard for team physical health.", successDefinition: "Weekly active use > 40%." },
    { name: "Project Echo", budget: 90000, deadline: new Date("2026-05-30"), status: "Upcoming", priority: "High", team: "Beta", problemStatement: "Revisiting legacy incident reports for AI training.", successDefinition: "50,000 logs processed." },
    { name: "Project Nova", budget: 130000, deadline: new Date("2026-07-22"), status: "Ongoing", priority: "Medium", team: "Sigma", problemStatement: "Testing next-gen deployment pipelines.", successDefinition: "Deployment time under 2 mins." },
    { name: "Cloud Migration Phoenix", budget: 670000, deadline: new Date("2026-09-30"), status: "Ongoing", priority: "High", team: "Alpha", problemStatement: "Lift and shift legacy mainframes to cloud native.", successDefinition: "Decommission physical servers." },
    { name: "Project Titan", budget: 260000, deadline: new Date("2026-11-10"), status: "Upcoming", priority: "Medium", team: "Gamma", problemStatement: "Stress test simulation environment for platform load.", successDefinition: "Simulate 5M concurrent users." }
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

const dummyUsersData = [
    { emailPrefix: 'coo', firstName: 'Jonathan', lastName: 'Reese', role: 'ADMIN', position: 'Chief Operating Officer', department: 'Executive Core' },
    { emailPrefix: 'cto', firstName: 'Marcus', lastName: 'Chen', role: 'ADMIN', position: 'Chief Technology Officer', department: 'Executive Core' },
    { emailPrefix: 'inv1', firstName: 'Eleanor', lastName: 'Vance', role: 'INVESTOR', position: 'Lead Partner, Apex Ventures', department: 'Board of Directors' },
    { emailPrefix: 'inv2', firstName: 'William', lastName: 'Thorne', role: 'INVESTOR', position: 'Venture Capitalist', department: 'Board of Directors' },
    { emailPrefix: 'inv3', firstName: 'Sophia', lastName: 'Laurent', role: 'INVESTOR', position: 'Angel Investor', department: 'Board of Directors' },
    { emailPrefix: 'vp.eng', firstName: 'David', lastName: 'Kim', role: 'MANAGER', position: 'VP of Engineering', department: 'Engineering' },
    { emailPrefix: 'vp.prod', firstName: 'Sarah', lastName: 'Oconnor', role: 'MANAGER', position: 'VP of Product', department: 'Product' },
    { emailPrefix: 'dir.design', firstName: 'Maya', lastName: 'Patel', role: 'MANAGER', position: 'Director of Design', department: 'Design' },
    { emailPrefix: 'dir.sec', firstName: 'James', lastName: 'Holden', role: 'MANAGER', position: 'Director of Infosec', department: 'Security' },
    { emailPrefix: 'lead.be', firstName: 'Elena', lastName: 'Rostova', role: 'MEMBER', position: 'Lead Backend Engineer', department: 'Engineering' },
    { emailPrefix: 'lead.fe', firstName: 'Michael', lastName: 'Chang', role: 'MEMBER', position: 'Lead Frontend Engineer', department: 'Engineering' },
    { emailPrefix: 'snr.dev1', firstName: 'Amir', lastName: 'Hassan', role: 'MEMBER', position: 'Senior Fullstack Engineer', department: 'Engineering' },
    { emailPrefix: 'snr.dev2', firstName: 'Jessica', lastName: 'Nolan', role: 'MEMBER', position: 'Senior Software Engineer', department: 'Engineering' },
    { emailPrefix: 'data.sci', firstName: 'Robert', lastName: 'Ford', role: 'MEMBER', position: 'Principal Data Scientist', department: 'Intelligence' },
    { emailPrefix: 'devops', firstName: 'Naomi', lastName: 'Nagata', role: 'MEMBER', position: 'DevOps Platform Engineer', department: 'Platform' },
    { emailPrefix: 'sec.eng', firstName: 'Aiden', lastName: 'Pearce', role: 'MEMBER', position: 'Security Analyst', department: 'Security' },
    { emailPrefix: 'qa.lead', firstName: 'Chloe', lastName: 'Price', role: 'MEMBER', position: 'QA Automation Lead', department: 'Quality Assurance' },
    { emailPrefix: 'prod.mgr', firstName: 'Nathan', lastName: 'Drake', role: 'MEMBER', position: 'Product Manager', department: 'Product' },
    { emailPrefix: 'ux.lead', firstName: 'Lara', lastName: 'Croft', role: 'MEMBER', position: 'Senior UX Researcher', department: 'Design' },
    { emailPrefix: 'ui.des', firstName: 'Simon', lastName: 'Ghost', role: 'MEMBER', position: 'UI Designer', department: 'Design' },
    { emailPrefix: 'jr.dev', firstName: 'Peter', lastName: 'Parker', role: 'INTERN', position: 'Junior Developer Intern', department: 'Engineering' },
    { emailPrefix: 'data.int', firstName: 'Miles', lastName: 'Morales', role: 'INTERN', position: 'Data Science Intern', department: 'Intelligence' },
    { emailPrefix: 'mkt.int', firstName: 'Gwen', lastName: 'Stacy', role: 'INTERN', position: 'Marketing Intern', department: 'Marketing' },

    // NEW ADDITIONS
    { emailPrefix: 'cfo', firstName: 'Victoria', lastName: 'Hand', role: 'ADMIN', position: 'Chief Financial Officer', department: 'Executive Core' },
    { emailPrefix: 'chro', firstName: 'Phil', lastName: 'Coulson', role: 'ADMIN', position: 'Chief HR Officer', department: 'Executive Core' },
    { emailPrefix: 'inv4', firstName: 'Tony', lastName: 'Stark', role: 'INVESTOR', position: 'Principal Partner', department: 'Board of Directors' },
    { emailPrefix: 'inv5', firstName: 'Bruce', lastName: 'Wayne', role: 'INVESTOR', position: 'Silent Partner', department: 'Board of Directors' },
    { emailPrefix: 'dir.strat', firstName: 'Nick', lastName: 'Fury', role: 'MANAGER', position: 'Director of Strategy', department: 'Operations' },
    { emailPrefix: 'vp.sales', firstName: 'Pepper', lastName: 'Potts', role: 'MANAGER', position: 'VP of Sales', department: 'Sales & Comms' },
    { emailPrefix: 'dir.mktg', firstName: 'Carol', lastName: 'Danvers', role: 'MANAGER', position: 'Director of Marketing', department: 'Marketing' },
    { emailPrefix: 'arch', firstName: 'Stephen', lastName: 'Strange', role: 'MEMBER', position: 'Systems Architect', department: 'Engineering' },
    { emailPrefix: 'lead.mobile', firstName: 'Wanda', lastName: 'Maximoff', role: 'MEMBER', position: 'Lead Mobile Engineer', department: 'Engineering' },
    { emailPrefix: 'snr.qa', firstName: 'Sam', lastName: 'Wilson', role: 'MEMBER', position: 'Senior QA Engineer', department: 'Quality Assurance' },
    { emailPrefix: 'sec.spec', firstName: 'Natasha', lastName: 'Romanoff', role: 'MEMBER', position: 'Security Specialist', department: 'Security' },
    { emailPrefix: 'snr.data', firstName: 'Bruce', lastName: 'Banner', role: 'MEMBER', position: 'Senior Data Analyst', department: 'Intelligence' },
    { emailPrefix: 'cloud.eng', firstName: 'Victor', lastName: 'Stone', role: 'MEMBER', position: 'Cloud Infrastructure Engineer', department: 'Platform' },
    { emailPrefix: 'ui.eng', firstName: 'Janet', lastName: 'Van Dyne', role: 'MEMBER', position: 'UI Developer', department: 'Design' },
    { emailPrefix: 'ux.des', firstName: 'Matt', lastName: 'Murdock', role: 'MEMBER', position: 'UX Designer', department: 'Design' },
    { emailPrefix: 'copy.lead', firstName: 'Jessica', lastName: 'Jones', role: 'MEMBER', position: 'Lead Copywriter', department: 'Marketing' },
    { emailPrefix: 'legal', firstName: 'Jennifer', lastName: 'Walters', role: 'MEMBER', position: 'Legal Counsel', department: 'Legal' },
    { emailPrefix: 'hr.spec', firstName: 'Luke', lastName: 'Cage', role: 'MEMBER', position: 'HR Specialist', department: 'Human Resources' },
    { emailPrefix: 'ops.mgr', firstName: 'Danny', lastName: 'Rand', role: 'MANAGER', position: 'Operations Manager', department: 'Operations' },
    { emailPrefix: 'fin.anl', firstName: 'Frank', lastName: 'Castle', role: 'MEMBER', position: 'Financial Analyst', department: 'Finance' },
    { emailPrefix: 'sup.lead', firstName: 'Steve', lastName: 'Rogers', role: 'MEMBER', position: 'Customer Support Lead', department: 'Operations' },
    { emailPrefix: 'jr.ui', firstName: 'Kamala', lastName: 'Khan', role: 'INTERN', position: 'Junior UI Intern', department: 'Design' },
    { emailPrefix: 'jr.qa', firstName: 'America', lastName: 'Chavez', role: 'INTERN', position: 'QA Intern', department: 'Quality Assurance' },
    { emailPrefix: 'ops.int', firstName: 'Kate', lastName: 'Bishop', role: 'INTERN', position: 'Operations Intern', department: 'Operations' },
    { emailPrefix: 'mkt.int2', firstName: 'Cassie', lastName: 'Lang', role: 'INTERN', position: 'Marketing Intern', department: 'Marketing' }
];

/**
 * Seeds a new organization with mock data.
 * @param {string} organizationId 
 * @param {string} creatorId 
 */
const seedNewOrganization = async (organizationId, creatorId) => {
    try {
        console.log(`[Seeder] Seeding new organization: ${organizationId}`);

        // 1. Create Dummy Team Members (so we have people to assign tickets to)
        // We'll use a random suffix to avoid email collisions if multiple orgs are created
        const randomSuffix = Math.floor(Math.random() * 10000);
        const hashedPassword = await bcrypt.hash('password123', 10);

        const teamMembers = [];

        // Add the creator to the pool and initialize avatar and position
        const creator = await prisma.user.update({
            where: { id: creatorId },
            data: {
                profilePicture: `https://randomuser.me/api/portraits/men/44.jpg`,
                position: 'Founder & CEO',
                department: 'Executive Core',
                role: 'FOUNDER'
            }
        });
        teamMembers.push(creator);

        // Generate users
        for (let i = 0; i < dummyUsersData.length; i++) {
            const u = dummyUsersData[i];
            const email = `${u.emailPrefix}.${randomSuffix}@clarity.local`;

            // We simply resolve male/female avatars dynamically.
            const genericMaleNames = ['Jonathan', 'Marcus', 'William', 'David', 'James', 'Michael', 'Amir', 'Robert', 'Aiden', 'Nathan', 'Simon', 'Peter', 'Miles', 'Phil', 'Tony', 'Bruce', 'Nick', 'Stephen', 'Sam', 'Victor', 'Matt', 'Luke', 'Danny', 'Frank', 'Steve'];
            const isMale = genericMaleNames.includes(u.firstName);
            const gender = isMale ? 'men' : 'women';
            // Use ID offset to get varied pictures
            const picId = (i + 15) % 99; // API has 0-99 images

            const user = await prisma.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    role: u.role,
                    position: u.position,
                    department: u.department,
                    organizationId,
                    profilePicture: `https://randomuser.me/api/portraits/${gender}/${picId}.jpg`
                }
            });
            teamMembers.push(user);
        }

        // 2. Create Projects
        const projects = [];
        for (const p of projectsData) {
            // Pick a random varying size for the team (at least 2 members)
            const numMembers = Math.floor(Math.random() * (teamMembers.length - 1)) + 2;
            const shuffledMembers = [...teamMembers].sort(() => 0.5 - Math.random());
            const selectedMembers = shuffledMembers.slice(0, numMembers);

            const project = await prisma.project.create({
                data: {
                    ...p,
                    organizationId,
                    members: {
                        connect: selectedMembers.map(m => ({ id: m.id }))
                    }
                },
                include: { members: true }
            });
            projects.push(project);
        }

        // 3. Create Tickets
        for (const project of projects) {
            // Introduce high variance in ticket counts for analytical displays
            const variances = [3, 42, 12, 85, 19];
            const ticketCount = variances[projects.indexOf(project)] || Math.floor(Math.random() * 50) + 5;

            for (let i = 0; i < ticketCount; i++) {
                const assigneePool = project.members; // exclusively use native project members
                const assignee = assigneePool[Math.floor(Math.random() * assigneePool.length)];
                const creator = assigneePool[Math.floor(Math.random() * assigneePool.length)];

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
                        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
                    }
                });
            }
        }
        // 4. Create Workflows for Projects
        for (const project of projects) {
            const workflow = await prisma.workflow.create({
                data: {
                    name: "Standard Engineering Flow",
                    description: "The primary operational path for standard engineering tasks.",
                    isDefault: true,
                    projectId: project.id
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
        }

        console.log(`[Seeder] Successfully seeded org ${organizationId}`);
    } catch (error) {
        console.error('[Seeder] Failed to seed organization:', error);
        // Don't throw, just log. We don't want to fail registration just because seeding failed.
    }
};

module.exports = { seedNewOrganization };
