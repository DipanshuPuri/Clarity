# Development Walkthrough

## Architecture Overview

Clarity follows a standard full-stack architecture with a React SPA frontend communicating with a RESTful Express backend, backed by PostgreSQL via Prisma ORM.

### Backend (Express + Prisma)
- RESTful API with controllers for releases, workflows, projects, tickets, users, and dashboard data.
- Middleware chain: authentication (JWT cookie verification) → RBAC checks → freeze guards → controller logic.
- Prisma schema manages Users, Projects, Tickets, Workflows (with Nodes and Edges), Releases (with ChecklistItems and DeploymentLogs), and Organization entities.

### Frontend (React + Vite)
- Context-driven state management (`AuthContext`, `WorkflowContext`) without Redux.
- React Flow powers the Workflow DAG editor and the Release Deadline Proximity Graph.
- Tailwind CSS with custom utility classes for a premium enterprise design language.

## Key Technical Decisions

1. **Cookie-based JWT auth** over token-in-header for XSS resilience and seamless browser session management.
2. **React Flow + Dagre** for graph visualization with auto-layout and manual drag-and-drop persistence.
3. **Debounced auto-save** for workflow node positions — position drags bypass validation and save silently to avoid blocking the user.
4. **Release state machine** (`ACTIVE → FROZEN → READY → DEPLOYED`) with RBAC-gated transitions and Founder override capability.
5. **Dual-mode workflow editor** (Payload/Configure) to separate read-only operational view from structural editing.

## Database Seeding
The project includes comprehensive seed scripts that populate the database with realistic mock data across all entities — projects with full ticket boards, team rosters, release branches with risk telemetry, and workflow DAGs.
