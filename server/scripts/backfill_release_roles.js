const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfillReleaseRoles() {
    try {
        console.log("Backfilling roles for ACTIVE and READY releases...");

        const org = await prisma.organization.findFirst();
        if (!org) {
            console.error("No organization found.");
            return;
        }

        // Get all ACTIVE and READY releases
        const releases = await prisma.release.findMany({
            where: { 
                organizationId: org.id,
                status: { in: ['ACTIVE', 'READY'] }
            },
            include: {
                projects: {
                    include: {
                        members: true
                    }
                }
            }
        });

        console.log(`Found ${releases.length} eligible releases to augment.`);

        let updatedCount = 0;

        for (const release of releases) {
            // Aggregate all members from all projects attached to this release
            let availableMembers = [];
            for (const project of release.projects) {
                availableMembers.push(...project.members);
            }

            // Deduplicate members by ID
            const uniqueMembersMap = new Map();
            availableMembers.forEach(m => uniqueMembersMap.set(m.id, m));
            const uniqueMembers = Array.from(uniqueMembersMap.values());

            if (uniqueMembers.length === 0) {
                console.log(`Skipping Release '${release.name}' - no associated project members.`);
                continue;
            }

            // Shuffle unique members
            const shuffled = [...uniqueMembers].sort(() => 0.5 - Math.random());

            // Assign roles
            const engOwnerId = shuffled.length > 0 ? shuffled[0].id : null;
            const qaOwnerId = shuffled.length > 1 ? shuffled[1].id : engOwnerId;
            const deployOwnerId = shuffled.length > 2 ? shuffled[2].id : engOwnerId;

            await prisma.release.update({
                where: { id: release.id },
                data: {
                    engOwnerId,
                    qaOwnerId,
                    deployOwnerId
                }
            });

            updatedCount++;
            console.log(`Updated Release '${release.name}' with Eng/QA/Deploy roles.`);
        }

        console.log(`\nFinished backfilling roles. Updated ${updatedCount} releases.`);

    } catch (error) {
        console.error("Backfill script failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

backfillReleaseRoles();
