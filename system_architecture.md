# Clarity: System Architecture

## 1. Technology Stack
**Backend**:
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (Stateless)
- **Permissions**: RBAC (Member, Manager)

**Frontend**:
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State**: React State / Context (No Redux)

**DevOps**:
- **Containerization**: Docker
- **Cloud**: AWS (EC2/EB, RDS, S3+CloudFront)

## 2. Architecture Diagram (Conceptual)
```mermaid
graph TD
    Client[React Frontend] -->|REST API (JSON)| LB[Load Balancer / Nginx]
    LB --> Server[Node.js / Express Server]
    
    subgraph "Backend Layer"
        Server -->|Auth Middleware| JWT[JWT Validation]
        Server -->|Business Logic| Controllers
        Controllers -->|Data Access| Prisma[Prisma Client]
    end
    
    subgraph "Data Layer"
        Prisma -->|TCP| DB[(PostgreSQL)]
    end
```

## 3. Responsibility Boundaries

### Frontend (The View)
- **Responsibility**: Presenting data and capturing user intent.
- **Logic Limit**: Only contains *UI logic* (toggles, form validation, navigation).
- **Rule**: "The frontend assumes the user is lying." It never enforces business rules for security (e.g., checking if a user *can* approve a decision is visual only; the backend must re-check).

### Backend (The Brain)
- **Responsibility**: Enforcing the "Clarity Flow" (Intent -> Decision -> Outcome).
- **Truth**: The only source of truth.
- **Why Business Rules Living Here?**:
    1. **Security**: Clients can be manipulated.
    2. **Consistency**: Changes to rules apply to all clients immediately.
    3. **Integrity**: Enforcing the strict parent-child relationships (Orphan prevention).

## 4. Folder Structure Plan

### Backend (`/server`)
```text
/src
  /config         # Env vars, DB connection
  /controllers    # Request handlers (input/output)
  /middlewares    # Auth, Validation
  /routes         # API definitions
  /services       # Business logic (The "Clarity" rules)
  /utils          # Helpers
  app.js          # Entry point
prisma/
  schema.prisma   # Database Schema
```

### Frontend (`/client`)
```text
/src
  /assets         # Images, fonts
  /components     # Reusable UI (Buttons, Cards)
  /features       # Domain features (IntentList, DecisionForm)
  /layouts        # Page wrappers
  /pages          # Route destinations
  /services       # API calls (axios/fetch wrappers)
  App.jsx
```
