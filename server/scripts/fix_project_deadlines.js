const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixDeadlines() {
    try {
        console.log("Fixing project deadlines...");

        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'asc' }
        });

        if (projects.length === 0) {
            console.log("No projects found.");
            return;
        }

        // Realistic deadline spreads: some past (critical/delayed), some upcoming, some far out
        const deadlineOffsets = [
            // Days from now. Negative = past (overdue/critical), positive = future
            { offsetDays: -15, label: 'overdue' },      // 1st project
            { offsetDays: 45,  label: 'comfortable' },   // 2nd
            { offsetDays: -3,  label: 'critical' },      // 3rd
            { offsetDays: 120, label: 'far out' },        // 4th
            { offsetDays: 8,   label: 'soon' },           // 5th
            { offsetDays: 60,  label: 'moderate' },       // 6th
            { offsetDays: -7,  label: 'overdue' },        // 7th
            { offsetDays: 30,  label: 'upcoming' },       // 8th
            { offsetDays: 90,  label: 'comfortable' },    // 9th
            { offsetDays: 14,  label: 'soon' },           // 10th
            { offsetDays: -1,  label: 'critical' },       // 11th
            { offsetDays: 180, label: 'far out' },        // 12th
            { offsetDays: 21,  label: 'upcoming' },       // 13th
            { offsetDays: 5,   label: 'imminent' },       // 14th
            { offsetDays: 75,  label: 'moderate' },       // 15th
            { offsetDays: -10, label: 'overdue' },        // 16th
            { offsetDays: 40,  label: 'comfortable' },    // 17th
            { offsetDays: 100, label: 'far out' },        // 18th
            { offsetDays: 3,   label: 'imminent' },       // 19th
            { offsetDays: 55,  label: 'moderate' },       // 20th
            { offsetDays: -20, label: 'overdue' },        // 21st
            { offsetDays: 25,  label: 'upcoming' },       // 22nd
            { offsetDays: 150, label: 'far out' },        // 23rd
            { offsetDays: 10,  label: 'soon' },           // 24th
            { offsetDays: -5,  label: 'critical' },       // 25th
            { offsetDays: 35,  label: 'upcoming' },       // 26th
            { offsetDays: 70,  label: 'moderate' },       // 27th
            { offsetDays: 200, label: 'far out' },        // 28th
            { offsetDays: 15,  label: 'soon' },           // 29th
            { offsetDays: -2,  label: 'critical' },       // 30th
        ];

        const now = new Date();

        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            const offset = deadlineOffsets[i % deadlineOffsets.length];
            const deadline = new Date(now.getTime() + offset.offsetDays * 86400000);

            await prisma.project.update({
                where: { id: project.id },
                data: { deadline }
            });

            console.log(`  ${project.name}: ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${offset.label})`);
        }

        console.log(`\nUpdated ${projects.length} projects with varying deadlines.`);

    } catch (error) {
        console.error("Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

fixDeadlines();
