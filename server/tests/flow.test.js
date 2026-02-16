const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/utils/prismaClient');

// Helper to clean db
const cleanDb = async () => {
    const tablenames = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    for (const { tablename } of tablenames) {
        if (tablename !== '_prisma_migrations') {
            try {
                await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
            } catch (error) {
                console.log({ error });
            }
        }
    }
};

describe('Clarity Integration Flow', () => {
    let token;
    let user;
    let projectId;
    let intentId;
    let taskId;

    beforeAll(async () => {
        // Ideally connect to a test db, assuming standard db for this quick setup
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    // 1. Auth Flow
    it('should signup and login', async () => {
        const email = `test-${Date.now()}@example.com`;
        // Signup
        const res = await request(app)
            .post('/auth/signup')
            .send({ email, password: 'password123', role: 'MANAGER' });

        expect(res.statusCode).toEqual(201);
        expect(res.body.user).toHaveProperty('id');
        user = res.body.user;

        // Login
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ email, password: 'password123' });

        expect(loginRes.statusCode).toEqual(200);
        // Extract cookie
        const cookies = loginRes.headers['set-cookie'];
        expect(cookies).toBeDefined();

        // For supertest, we usually grab the token directly if we returned it, 
        // or we have to send the cookie in subsequent requests.
        // Our backend sends token in cookie.
        token = cookies;
    });

    // 2. The Chain
    it('should create Project -> Intent -> Decision -> Task', async () => {
        // Create Project
        const pRes = await request(app)
            .post('/api/projects')
            .set('Cookie', token)
            .send({ name: 'Test Project' });
        expect(pRes.statusCode).toEqual(201);
        projectId = pRes.body.id;

        // Create Intent
        const iRes = await request(app)
            .post('/api/intents')
            .set('Cookie', token)
            .send({ title: 'Test Intent', description: 'desc', projectId });
        expect(iRes.statusCode).toEqual(201);
        intentId = iRes.body.id;

        // Create Task (Linked to Intent)
        const tRes = await request(app)
            .post('/api/tasks')
            .set('Cookie', token)
            .send({
                title: 'Test Task',
                problemStatement: 'prob',
                expectedOutcome: 'exp',
                intentId
            });
        expect(tRes.statusCode).toEqual(201);
        expect(tRes.body.status).toBe('TODO');
        taskId = tRes.body.id;
    });

    // 3. The Outcome Rule
    it('should auto-complete Task when Outcome is created', async () => {
        // Verify Task is TODO
        const taskBefore = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Cookie', token);
        expect(taskBefore.body.status).toBe('TODO');

        // Create Outcome
        const oRes = await request(app)
            .post('/api/outcomes')
            .set('Cookie', token)
            .send({
                taskId,
                success: true,
                notes: 'It worked',
                metrics: '100% good'
            });
        expect(oRes.statusCode).toEqual(201);

        // Verify Task is DONE
        const taskAfter = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Cookie', token);
        expect(taskAfter.body.status).toBe('DONE');
    });
});
