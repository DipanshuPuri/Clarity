const avatars = [
    "https://i.pravatar.cc/150?u=sarah",
    "https://i.pravatar.cc/150?u=jason",
    "https://i.pravatar.cc/150?u=elena",
    "https://i.pravatar.cc/150?u=david",
    "https://i.pravatar.cc/150?u=marcus",
    "https://i.pravatar.cc/150?u=clara"
];

const names = ["Sarah Chen", "Jason Park", "Elena Rodriguez", "David Kim", "Marcus Aurelius", "Clara Oswald"];

const statuses = ["To Do", "In Progress", "Done"];
const priorities = ["Critical", "High", "Medium", "Low"];

const generateTickets = () => {
    const tickets = [];
    const projectIds = ["PRJ-9901", "PRJ-9902", "PRJ-9903", "PRJ-9904", "PRJ-9905", "PRJ-9906", "PRJ-9907", "PRJ-9908", "PRJ-9909", "PRJ-9910"];

    projectIds.forEach(projId => {
        // Generate 10-25 tickets per project
        const count = Math.floor(Math.random() * 15) + 10;
        for (let i = 1; i <= count; i++) {
            const userIdx = Math.floor(Math.random() * names.length);
            tickets.push({
                id: `TKT-${projId.split('-')[1]}-${100 + i}`,
                projectId: projId,
                title: `${['Fix', 'Implement', 'Audit', 'Update', 'Refactor', 'Explore'][Math.floor(Math.random() * 6)]} ${['Schema', 'API', 'UI', 'Security', 'Logic', 'Sync'][Math.floor(Math.random() * 6)]} ${['module', 'hook', 'layer', 'protocol', 'node', 'container'][Math.floor(Math.random() * 6)]}`,
                description: "Detailed system intervention required to maintain strategic alignment with the operational directive.",
                assignee: { name: names[userIdx], avatar: avatars[userIdx] },
                createdBy: i % 3 === 0 ? "CURRENT_USER" : `USR-${Math.floor(Math.random() * 1000)}`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
                comments: []
            });
        }
    });
    return tickets;
};

export const ticketsData = generateTickets();
