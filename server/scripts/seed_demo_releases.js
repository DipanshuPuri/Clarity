const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    try {
        console.log("Starting demo release seeding...");
        
        const org = await prisma.organization.findFirst();
        if (!org) {
            console.error("No organization found. Please run wipeAndSeed.js first.");
            return;
        }

        const user = await prisma.user.findFirst({
            where: { organizationId: org.id, role: 'FOUNDER' }
        }) || await prisma.user.findFirst({
            where: { organizationId: org.id }
        });

        if (!user) {
            console.error("No user found in organization.");
            return;
        }

        console.log(`Using Org: ${org.name} (${org.id}) and User: ${user.email}`);

        const releaseData = [
            {
                name: 'Project Titan - Core Engine',
                description: 'Critical overhaul of the Titan Core execution logic.',
                status: 'ACTIVE',
                readinessScore: 42,
                projectName: 'Project Titan',
                targetDate: new Date(Date.now() + 86400000 * 3),
                freezeDate: new Date(Date.now() + 86400000 * 1),
                checklists: [
                    { title: 'Titan core unit test suite > 95%', completionState: true },
                    { title: 'Concurrent logging stress test', completionState: false },
                    { title: 'Refactor approval from Arch Board', completionState: false }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Initiated Titan core refactor' }
                ]
            },
            {
                name: 'Cloud Migration Phoenix - Phase 1',
                description: 'Transitioning the Phoenix infrastructure to a hybrid-cloud architecture.',
                status: 'FROZEN',
                readinessScore: 88,
                projectName: 'Cloud Migration Phoenix',
                targetDate: new Date(Date.now() - 86400000 * 1),
                freezeDate: new Date(Date.now() - 86400000 * 3),
                checklists: [
                    { title: 'Cloud-native driver validation', completionState: true },
                    { title: 'Sync latency below 50ms', completionState: true },
                    { title: 'PostgreSQL cluster migration verify', completionState: false }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Phoenix phase 1 kickoff' }
                ]
            },
            {
                name: 'Project Nova - Analytics Bridge',
                description: 'Implementing the Nova Bridge to connect core analytics with executive visualization modules.',
                status: 'ACTIVE',
                readinessScore: 12,
                projectName: 'Project Nova',
                targetDate: new Date(Date.now() + 86400000 * 14),
                checklists: [
                    { title: 'Schema definition for Nova stream', completionState: false },
                    { title: 'API gateway endpoint authorization', completionState: false }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Nova Bridge active development' }
                ]
            },
            {
                name: 'Neural Network Expansion - Inference Tier',
                description: 'Scaling the inference tier for the Neural Network module.',
                status: 'READY',
                readinessScore: 97,
                projectName: 'Neural Network Expansion',
                targetDate: new Date(Date.now() + 86400000 * 1),
                checklists: [
                    { title: 'Model load test results verified', completionState: true },
                    { title: 'Weight distribution latency < 200ms', completionState: true }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Inference tier optimization kickoff' }
                ]
            },
            {
                name: 'Project Echo - Notification Hub',
                description: 'Refactoring the Echo notification hub.',
                status: 'ACTIVE',
                readinessScore: 55,
                projectName: 'Project Echo',
                targetDate: new Date(Date.now() + 86400000 * 10),
                freezeDate: new Date(Date.now() + 86400000 * 7),
                checklists: [
                    { title: 'Cross-platform push token sync', completionState: true },
                    { title: 'Message dispatch queue stress test', completionState: false },
                    { title: 'Echo hub auth protocols', completionState: true }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Echo hub architectural improvement' }
                ]
            },
            {
                name: 'Identity Shield V2 - Core Security',
                description: 'Hardening the Identity Shield infrastructure.',
                status: 'FROZEN',
                readinessScore: 76,
                projectName: 'Identity Shield V2',
                targetDate: new Date(Date.now() + 86400000 * 5),
                freezeDate: new Date(Date.now() - 86400000 * 2),
                checklists: [
                    { title: 'Encryption key rotation dry-run', completionState: true },
                    { title: 'Session hijacking simulation', completionState: false },
                    { title: 'MFA callback reliability test', completionState: true }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Identity Shield security cycle' }
                ]
            },
            {
                name: 'Predictive Intent V3 - Logic Tier',
                description: 'Deploying the V3 logic tier for Predictive Intent.',
                status: 'ACTIVE',
                readinessScore: 18,
                projectName: 'Predictive Intent V3',
                targetDate: new Date(Date.now() + 86400000 * 28),
                checklists: [
                    { title: 'Probability model validation', completionState: false },
                    { title: 'Decision tier backtesting complete', completionState: false }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'V3 inference logic active development' }
                ]
            },
            {
                name: 'Global Ops Gateway - Legacy Sync',
                description: 'Maintenance cycle for the Global Ops Gateway.',
                status: 'DEPLOYED',
                readinessScore: 100,
                projectName: 'Global Ops Gateway',
                targetDate: new Date(Date.now() - 86400000 * 12),
                freezeDate: new Date(Date.now() - 86400000 * 15),
                checklists: [
                    { title: 'TLS 1.3 protocol verification', completionState: true },
                    { title: 'Legacy buffer overflow audit', completionState: true }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Security maintenance for Global Gateway' }
                ]
            },
            {
                name: 'Project Sentinel - Threat Detection',
                description: 'Advanced real-time threat detection engine.',
                status: 'DEPLOYED',
                readinessScore: 100,
                projectName: 'Project Sentinel',
                targetDate: new Date(Date.now() - 86400000 * 5),
                checklists: [
                    { title: 'Anomalous pattern matching > 99%', completionState: true },
                    { title: 'Auto-response latency < 500ms', completionState: true }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Sentinel core initialization' }
                ]
            },
            {
                name: 'Quantum Ledger - Distribution Tier',
                description: 'Rebuilding the distribution tier for the Quantum Ledger.',
                status: 'ACTIVE',
                readinessScore: 62,
                projectName: 'Quantum Ledger',
                targetDate: new Date(Date.now() + 86400000 * 8),
                checklists: [
                    { title: 'State consistency validation loop', completionState: true },
                    { title: 'High-frequency peer sync test', completionState: false }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Quantum distribution overhaul' }
                ]
            },
            {
                name: 'Aurora UI - Design System V4',
                description: 'Major update to the Aurora design system.',
                status: 'FROZEN',
                readinessScore: 82,
                projectName: 'Aurora UI',
                targetDate: new Date(Date.now() + 86400000 * 2),
                freezeDate: new Date(Date.now() - 86400000 * 1),
                checklists: [
                    { title: 'Component-wide blur optimization', completionState: true },
                    { title: 'Animation frame rate audit > 60fps', completionState: false }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Aurora V4 design cycle' }
                ]
            },
            {
                name: 'Data Lake Alpha - Ingestion Pipeline',
                description: 'Optimizing the ingestion pipeline for Data Lake Alpha.',
                status: 'READY',
                readinessScore: 95,
                projectName: 'Data Lake Alpha',
                targetDate: new Date(Date.now() + 86400000 * 1),
                checklists: [
                    { title: 'Parallel stream ingestion test', completionState: true },
                    { title: 'Schema inference accuracy > 99%', completionState: true }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Alpha ingestion optimization' }
                ]
            },
            {
                name: 'Horizon Gateway - Cross-Region Sync',
                description: 'Implementing cross-region synchronization for the Horizon Gateway.',
                status: 'ACTIVE',
                readinessScore: 5,
                projectName: 'Horizon Gateway',
                targetDate: new Date(Date.now() + 86400000 * 45),
                checklists: [
                    { title: 'Region sovereignty mapping', completionState: false },
                    { title: 'Gateway auth handshake protocol', completionState: false }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Horizon Gateway global phase' }
                ]
            },
            {
                name: 'Neural Link - Kinetic Interface',
                description: 'Development of the Kinetic Interface module for Neural Link.',
                status: 'ACTIVE',
                readinessScore: 32,
                projectName: 'Neural Link',
                targetDate: new Date(Date.now() - 86400000 * 4),
                checklists: [
                    { title: 'Kinetic signal calibration', completionState: true },
                    { title: 'Latency threshold verification (< 5ms)', completionState: false }
                ],
                audits: [
                    { eventType: 'release_created', reason: 'Kinetic interface kickoff' }
                ]
            }
        ];

        for (const rel of releaseData) {
            // Find or create project
            let project = await prisma.project.findFirst({
                where: { name: rel.projectName, organizationId: org.id }
            });

            if (!project) {
                console.log(`Creating missing project: ${rel.projectName}`);
                project = await prisma.project.create({
                    data: {
                        name: rel.projectName,
                        problemStatement: `Mission critical infrastructure for ${rel.projectName}`,
                        successDefinition: 'Operational excellence.',
                        organizationId: org.id,
                        status: 'Ongoing'
                    }
                });
            }

            // Create or update Release
            const existingRel = await prisma.release.findFirst({
                where: { name: rel.name, organizationId: org.id }
            });

            if (existingRel) {
                console.log(`Release already exists, skipping: ${rel.name}`);
                continue;
            }

            console.log(`Creating release: ${rel.name}`);
            const newRel = await prisma.release.create({
                data: {
                    name: rel.name,
                    description: rel.description,
                    status: rel.status,
                    readinessScore: rel.readinessScore,
                    targetDate: rel.targetDate,
                    freezeDate: rel.freezeDate,
                    organizationId: org.id,
                    releaseOwnerId: user.id,
                    projects: {
                        connect: { id: project.id }
                    }
                }
            });

            // Add checklists
            for (const cl of rel.checklists) {
                await prisma.releaseChecklist.create({
                    data: {
                        title: cl.title,
                        completionState: cl.completionState,
                        releaseId: newRel.id
                    }
                });
            }

            // Add audits
            for (const au of rel.audits) {
                await prisma.releaseScopeAudit.create({
                    data: {
                        eventType: au.eventType,
                        reason: au.reason,
                        releaseId: newRel.id,
                        userId: user.id
                    }
                });
            }
        }

        console.log("Seeding complete.");

    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
