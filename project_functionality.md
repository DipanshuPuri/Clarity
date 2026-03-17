# Project Functionality Documentation

Clarity is a release and workflow management platform designed for organizational transparency across deployments, team structures, and project execution.

## 1. Global Navigation & Core Structure
- **Main Layout**: Persistent sidebar navigation with access to all modules.
- **Top Navbar**: Displays global context, project state, and user profile access.
- **Fade-In Transitions**: 200ms entry animations on every page mount.

---

## 2. Dashboard (`/app/dashboard`)
The command center for organizational awareness.
- **Execution Queue**: Bar chart tracking project ticket distributions with uniform bar widths and scrollable resource allocation list.
- **System Event Audit**: Vertical timeline showing granular system logs (Severity, Subsystem, Event ID, Service).
- **Project Analytics**: Full-width interactive bar graphs showing workload distribution across projects.

---

## 3. Workflows (`/app/workflow`)
A visual graph engine for defining organizational logic.
- **Two Distinct Modes**:
  - **Overview (Payload)**: Read-only mode for viewing execution history, attached notes, and discussion threads.
  - **Configure**: Interactive DAG editor for modifying graph structure.
- **Canvas Interface**:
  - Drag-and-drop node positioning with auto-persistence to PostgreSQL (debounced auto-save on position changes).
  - Automated auto-layout via the Dagre algorithm for new or unpositioned workflows.
- **CRUD Operations**:
  - Add/Remove Events (Nodes), Connections (Edges), and Text Boxes (Notes).
  - Validation Gate: Every node/edge requires a name, description, and owner before saving.
- **In-App Modals**: Custom dialogs for validation alerts and owner selection (roster-based).
- **Dirty State Management**: Position-only changes auto-save silently without flagging unsaved changes. Structural changes trigger the unsaved-changes guard.

---

## 4. Releases (`/app/releases`)
Mission control for deployment orchestration.

### Initialize Branch
- **Project-Level Selection**: Users initialize releases by selecting entire projects via a dual-pane selector modal with search filtering.
- **Auto-Branching**: Automatically generates Active Branches for newly committed projects.

### Active Branches
- Real-time tracker of release modules with dedicated risk telemetry and history logs.
- **Visual Hygiene**: For `DEPLOYED` modules, deadline and overdue flags are suppressed in the sidebar to maintain focus.
- **History**: Scrollable, fixed-height vertical audit log showing branch-specific events in reverse-chronological order.
- **Live Risk Telemetry**: Dynamic readiness scores driven by blocker counts and verification gate completion.
- **Role Assignment**: RBAC-gated flow for assigning Engineering, QA, and Deployment owners.

### Deadline Proximity Graph (Graph View)
- Displays the **5 releases closest to their deadline** (excluding deployed ones).
- Highlights incomplete checklist gates (red dashed edges), remaining tickets, and missing owner roles.
- Shows inter-release dependencies with animated edges.
- **Integrated Detail Panel**: Clicking a release node opens a right-side panel showing readiness score, team roster with unassigned gaps, verification gates, remaining tickets, and linked projects. Clicking a ticket node shows status, priority, type, and assignee.

### Release Lifecycle
1. **ACTIVE** → Under development. Dynamic readiness score.
2. **FROZEN** → Payload locked for final verification.
3. **READY** → All gates passed. Deployable.
4. **DEPLOYED** → Live. Readiness locked at 100%.

---

## 5. Projects (`/app/projects`)
Full project management module.
- **Project List**: Searchable grid of all projects with status indicators, budget tracking, and deadline visibility.
- **Project Detail**: Individual project view with ticket lists, completion metrics, team members, and timeline tracking.
- **Ticket Management**: Create, assign, and track tickets with status (Open, In Progress, Review, Done), priority levels, and type classification.

---

## 6. Analytics (`/app/analytics`)
Organization-wide performance analytics.
- Workload distribution across projects.
- Velocity metrics and capacity tracking.
- Project performance comparisons.

---

## 7. Organization (`/app/org`)
Management of the human and institutional layer.
- **Platform Details**: Grid showing Deployment targets, Project counts, API usage, and Compliance status.
- **Team Roster**: Searchable list of all employees with avatars, roles, and department indicators.
- **Team Stats**: Metrics on organizational velocity and capacity.

---

## 8. Profile (`/app/profile`)
Personal workspace for the authenticated user.
- **User Settings**: Update personal information, position, and profile pictures.
- **Activity Log**: View personal contributions and historical actions.

---

## 9. Settings (`/app/settings`)
Application configuration and preferences.

---

## 10. Public Pages
- **Home** (`/`): Landing page with feature overview and call-to-action.
- **FAQ** (`/faq`): Frequently asked questions with expandable accordion UI.
- **Privacy Policy** (`/privacy`): Privacy policy documentation.
- **Terms of Service** (`/terms`): Terms of service documentation.

---

## 11. Authentication
- **JWT-Based Login**: Persistent session management via HttpOnly cookies.
- **Registration**: New user onboarding with role assignment.
- **Role-Based Access (RBAC)**: Six distinct roles — Intern, Member, Manager, Admin, Executive, and Founder — with escalating permissions.
- **Founder Bypass**: The Founder role can override certain restrictions (e.g., freeze guards) for operational flexibility.
