const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfillMissionCriticalProjects() {
    try {
        console.log("Backfilling sample data for Mission Critical Infrastructure projects...");

        const org = await prisma.organization.findFirst();
        if (!org) {
            console.error("No organization found. Run main seeder first.");
            return;
        }

        // Get all users to assign to projects
        const users = await prisma.user.findMany({
            where: { organizationId: org.id }
        });

        if (users.length === 0) {
            console.error("No users found to assign to projects.");
            return;
        }

        // Get the projects created by the release seeder
        const projects = await prisma.project.findMany({
            where: { 
                organizationId: org.id,
                problemStatement: { contains: 'Mission critical infrastructure' }
            }
        });

        console.log(`Found ${projects.length} projects to augment.`);

        const statuses = ['Ongoing', 'On Hold', 'Completed', 'Planning'];
        const priorities = ['Low', 'Medium', 'High', 'Critical'];
        const workflowNames = ['API Revamp', 'Auth V2', 'Database Scale', 'UI Polish', 'Frontend Core'];
        const ticketStatuses = ['To Do', 'In Progress', 'In Review', 'Done'];

        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            
            // 1. Update Project basic data (budget, status, members)
            const budget = 50000 + Math.floor(Math.random() * 200000); // 50k to 250k
            const status = statuses[i % statuses.length];
            
            // Pick a random subset of members (3 to 6 users)
            const numMembers = 3 + Math.floor(Math.random() * 4);
            const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
            const projectMembers = shuffledUsers.slice(0, numMembers);

            await prisma.project.update({
                where: { id: project.id },
                data: {
                    budget,
                    status,
                    team: `Unit Alpha-${i+1}`,
                    members: {
                        connect: projectMembers.map(u => ({ id: u.id }))
                    }
                }
            });

            // 2. Generate Tickets for the project
            // Give each project between 8 and 25 tickets
            const numTickets = 8 + Math.floor(Math.random() * 18);
            
            for (let j = 0; j < numTickets; j++) {
                // Determine ticket status based on project status
                let tStatus;
                if (status === 'Completed') {
                    tStatus = 'Done';
                } else if (status === 'Planning') {
                    tStatus = 'To Do';
                } else {
                    // Ongoing or On Hold: mix of statuses, weighted towards Done and In Progress
                    const rand = Math.random();
                    if (rand < 0.4) tStatus = 'Done';
                    else if (rand < 0.7) tStatus = 'In Progress';
                    else if (rand < 0.9) tStatus = 'In Review';
                    else tStatus = 'To Do';
                }

                // Random assignee from the project members
                const assignee = projectMembers[Math.floor(Math.random() * projectMembers.length)];

                await prisma.ticket.create({
                    data: {
                        title: `Infrastructure Task ${j+1}: ${workflowNames[j % workflowNames.length]}`,
                        description: `Execute deployment cycle for step ${j+1}. Ensure compliance with unit protocols.`,
                        status: tStatus,
                        priority: priorities[j % priorities.length],
                        type: j % 3 === 0 ? 'Bug' : 'Task',
                        projectId: project.id,
                        assigneeId: assignee.id,
                        createdById: projectMembers[0].id // Assigned by the first member (maybe a leader)
                    }
                });
            }

            console.log(`Updated Project ${project.name}: $${budget}, ${status}, ${projectMembers.length} members, ${numTickets} tickets.`);
        }

        console.log("\nFinished backfilling project data successfully.");

    } catch (error) {
        console.error("Backfill script failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

backfillMissionCriticalProjects();
