# Clarity — Release & Workflow Management Platform

A full-stack release management platform with a visual DAG workflow engine, live readiness telemetry, and a multi-state branch lifecycle. Built with React, Node.js, Express, PostgreSQL, and Prisma.

## Features

### Dashboard
Real-time command center with execution queue bar charts, system event audit timeline, and project analytics with resource allocation tracking.

### Workflows
Interactive DAG (Directed Acyclic Graph) editor powered by React Flow.
- **Payload Mode**: Read-only overview with execution history, notes, and discussion threads.
- **Configure Mode**: Drag-and-drop node editor with validation gates — every node and edge requires a name, description, and owner before saving.
- Auto-layout via Dagre algorithm. Position changes auto-save silently.

### Releases
Mission control for deployment orchestration.
- **Initialize Branch**: Select projects to scope into release branches.
- **Branch Lifecycle**: `ACTIVE → FROZEN → READY → DEPLOYED` state machine with RBAC-gated transitions.
- **Live Risk Telemetry**: Dynamic readiness scores, blocker counts, and verification gate status.
- **Deadline Proximity Graph**: Visual graph showing the 5 nearest-deadline releases with remaining tickets, missing owners, and incomplete checklist gates. Clicking nodes opens an integrated detail panel.
- **Role Assignment**: Assign Engineering, QA, and Deployment owners per release.

### Projects
Full project management with ticket tracking, budget monitoring, deadlines, and team member assignment.

### Organization
Team roster management with searchable employee directory, deployment targets, API usage stats, and compliance status.

### Analytics
Organization-wide analytics with workload distribution, velocity metrics, and project performance tracking.

### Authentication & RBAC
JWT-based authentication with cookie sessions. Six distinct roles: Intern, Member, Manager, Admin, Executive, and Founder — each with escalating permissions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18+, Vite, Tailwind CSS, React Flow, Lucide React |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, bcrypt, HttpOnly cookies |
| State | React Context API (WorkflowContext, AuthContext) |
| HTTP | Axios |

## Project Structure
```
client/          # React frontend (Vite)
├── src/
│   ├── pages/       # Dashboard, Releases, Workflows, Projects, etc.
│   ├── components/  # Reusable UI components
│   ├── context/     # React Context providers
│   ├── api/         # API client modules
│   └── mock/        # Mock data and templates
server/          # Node.js backend (Express)
├── src/
│   ├── controllers/ # Route handlers
│   ├── middlewares/  # Auth, RBAC, freeze guards
│   ├── routes/      # API route definitions
│   ├── services/    # Seeder and business logic
│   └── utils/       # Helper utilities
├── prisma/          # Schema and migrations
└── scripts/         # Data backfill and maintenance scripts
```

## Getting Started

### Prerequisites
- Node.js (LTS)
- PostgreSQL

### Installation
```bash
# Clone the repository
git clone https://github.com/DipanshuPuri/Clarity.git
cd Clarity

# Install dependencies
cd client && npm install
cd ../server && npm install

# Configure environment
# Create .env files in client/ and server/ with your database URL and JWT secret

# Run database migrations
cd server && npx prisma migrate dev

# Seed the database
node scripts/seed.js

# Start development servers
# Terminal 1
cd client && npm run dev

# Terminal 2
cd server && npm run dev
```

## Documentation
- [Project Functionality](project_functionality.md) — Detailed breakdown of every module
- [Tech Stack](tech_stack.md) — Full technology documentation
