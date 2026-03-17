const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getActiveDecisions = async (req, res) => {
    try {
        // Mock data for UI demonstration
        const mockDecisions = [
            {
                id: 'dec_1',
                title: 'Determine primary cloud provider for Q3 migration',
                rationale: 'We must finalize between AWS and GCP to align with the new microservices architecture before Q3 budget locks.',
                status: 'APPROVED',
                createdAt: new Date().toISOString(),
                intent: { title: 'Infrastructure Modernization' },
                author: { firstName: 'Alex', lastName: 'Chen' }
            },
            {
                id: 'dec_2',
                title: 'Approve updated RBAC policy definition',
                rationale: 'The new hierarchical role structure requires sign-off from all department heads before rollout to staging.',
                status: 'APPROVED',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                intent: { title: 'Security Hardening V2' },
                author: { firstName: 'Sarah', lastName: 'Jenkins' }
            },
            {
                id: 'dec_3',
                title: 'Select vendor for continuous integration pipeline',
                rationale: 'Evaluating GitHub Actions vs GitLab CI. Need decision to unblock the current release bottleneck.',
                status: 'APPROVED',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                intent: { title: 'DevOps Velocity' },
                author: { firstName: 'Marcus', lastName: 'Aurelius' }
            }
        ];

        res.json(mockDecisions);
    } catch (error) {
        console.error('Active decisions fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch active decisions' });
    }
};

const getReflectionRequired = async (req, res) => {
    try {
        const mockReflection = [
            {
                id: 'ref_1',
                title: 'Assess post-launch stability of v2.4',
                status: 'PROPOSED',
                intent: { title: 'Q1 Core Release' }
            },
            {
                id: 'ref_2',
                title: 'Review user feedback on new dashboard',
                status: 'PROPOSED',
                intent: { title: 'UI/UX Overhaul' }
            }
        ];
        res.json(mockReflection);
    } catch (error) {
        console.error('Reflection required fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch reflection requirements' });
    }
};

const getRecentLearnings = async (req, res) => {
    try {
        const mockLearnings = [
            {
                id: 'out_1',
                learning: 'Micro-frontends increased isolated deployment velocity by 40%, but require strict contract testing.',
                task: { intent: { title: 'Frontend Architecture' } }
            },
            {
                id: 'out_2',
                learning: 'User engagement metrics dropped when onboarding was expanded to 5 steps; concise flows are critical.',
                task: { intent: { title: 'User Acquisition' } }
            }
        ];
        res.json(mockLearnings);
    } catch (error) {
        console.error('Recent learnings fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch recent learnings' });
    }
};

const getOnboardingStatus = async (req, res) => {
    try {
        const organizationId = req.user?.organizationId;
        const [projectCount, intentCount] = await Promise.all([
            prisma.project.count({ where: { organizationId } }),
            prisma.intent.count({ where: { project: { organizationId } } })
        ]);
        res.json({ projectCount, intentCount });
    } catch (error) {
        console.error('Onboarding status fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch onboarding status' });
    }
};

const getDashboardData = async (req, res) => {
    try {
        const organizationId = req.user?.organizationId;
        const [activeDecisions, reflectionRequired, recentLearnings] = await Promise.all([
            prisma.decision.findMany({
                where: {
                    status: 'APPROVED',
                    intent: {
                        status: 'ACTIVE',
                        project: { organizationId }
                    }
                },
                include: { intent: { select: { title: true } }, author: { select: { firstName: true, lastName: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5
            }),
            prisma.decision.findMany({
                where: {
                    status: 'PROPOSED',
                    intent: {
                        project: { organizationId }
                    }
                },
                include: { intent: { select: { title: true } }, author: { select: { firstName: true, lastName: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5
            }),
            prisma.outcome.findMany({
                where: {
                    NOT: { learning: '' },
                    task: {
                        intent: {
                            project: { organizationId }
                        }
                    }
                },
                include: { task: { include: { decision: { select: { title: true } }, intent: { select: { title: true } } } } },
                orderBy: { createdAt: 'desc' },
                take: 5
            })
        ]);

        res.json({
            activeDecisions,
            reflectionRequired,
            recentLearnings
        });

    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

module.exports = {
    getDashboardData,
    getActiveDecisions,
    getReflectionRequired,
    getRecentLearnings,
    getOnboardingStatus
};
