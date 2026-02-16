/**
 * Database Seed Script
 * Creates test users for development
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create MANAGER user
    const managerHash = await bcrypt.hash('password123', 10);
    const manager = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            email: 'admin@test.com',
            passwordHash: managerHash,
            role: 'MANAGER'
        }
    });
    console.log('✅ Created MANAGER:', manager.email);

    // Create MEMBER user
    const memberHash = await bcrypt.hash('password123', 10);
    const member = await prisma.user.upsert({
        where: { email: 'member@test.com' },
        update: {},
        create: {
            email: 'member@test.com',
            passwordHash: memberHash,
            role: 'MEMBER'
        }
    });
    console.log('✅ Created MEMBER:', member.email);

    console.log('\n📋 Test Credentials:');
    console.log('   MANAGER: admin@test.com / password123');
    console.log('   MEMBER:  member@test.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
