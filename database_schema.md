# Clarity: Database Schema Design

## 1. Schema Overview & Philosophy
The schema is designed to enforce the lineage of work. It is strictly hierarchical to prevent "orphaned" work.

**Hierarchy**:
`Project` → `Intent` → `Decision` → `Task` → `Outcome`

- **Relational Modeling**: Essential here because the structure is rigid. We need strict Foreign Key constraints (e.g., `RESTRICT` on delete) to maintain history. A document store (Mongo) would be too loose for our "System of Record" goals.
- **Supporting the Vision**:
    - **Intent**: Captured in the `Intent` table (The "Why").
    - **Decision**: Captured in the `Decision` table (The "How").
    - **Outcome**: Captured in `Outcome` table, strictly linked to `Task` (The "Proof").

## 2. Table Definitions

### 1. User
*   **Role**: Authenticated actors.
*   **Fields**:
    - `id`: UUID, PK
    - `email`: String, Unique
    - `role`: Enum (MEMBER, MANAGER) - *Enforces "Only managers can create particular items" checks in app logic.*
    - `passwordHash`: String

### 2. Project
*   **Role**: Top-level container for workspaces or teams.
*   **Fields**:
    - `id`: UUID, PK
    - `name`: String
    - `description`: String

### 3. Intent (The "Why")
*   **Role**: Represents the problem to be solved.
*   **Fields**:
    - `id`: UUID, PK
    - `projectId`: FK -> Project
    - `title`: String
    - `description`: String
    - `status`: Enum (ACTIVE, COMPLETED, ARCHIVED)

### 4. Decision (The "How")
*   **Role**: The agreed-upon technical or product direction.
*   **Rules**: Cannot be deleted if Tasks exist (Enforced by FK). Only Managers create (Enforced by App Logic).
*   **Fields**:
    - `id`: UUID, PK
    - `intentId`: FK -> Intent
    - `title`: String
    - `rationale`: String (Why this choice?)
    - `status`: Enum (PROPOSED, APPROVED, REJECTED)
    - `authorId`: FK -> User

### 5. Task (The Execution)
*   **Role**: The actual work units.
*   **Rules**: Must have `problem_statement` and `expected_outcome` (Not null columns).
*   **Fields**:
    - `id`: UUID, PK
    - `decisionId`: FK -> Decision
    - `title`: String
    - `status`: Enum (TODO, IN_PROGRESS, DONE)
    - `problemStatement`: String (Required)
    - `expectedOutcome`: String (Required)
    - `assigneeId`: FK -> User

### 6. Outcome (The Proof)
*   **Role**: Formal record of the result.
*   **Rules**: A Task cannot be DONE without an Outcome (Enforced by App Logic Transaction: "If transitioning to DONE, Outcome must be present").
*   **Fields**:
    - `id`: UUID, PK
    - `taskId`: FK -> Task (Unique 1:1)
    - `metrics`: String
    - `success`: Boolean
    - `notes`: String

## 3. Prisma Schema Code

```prisma
// 1. Data Source & Generator
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 2. Enums
enum Role {
  MEMBER
  MANAGER
}

enum IntentStatus {
  ACTIVE
  COMPLETED
  ARCHIVED
}

enum DecisionStatus {
  PROPOSED
  APPROVED
  REJECTED
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

// 3. Models

model User {
  id           String     @id @default(uuid())
  email        String     @unique
  passwordHash String
  role         Role       @default(MEMBER)
  
  decisions    Decision[] // Decisions authored by user
  tasks        Task[]     // Tasks assigned to user
}

model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  
  intents     Intent[]
}

model Intent {
  id          String       @id @default(uuid())
  title       String
  description String
  status      IntentStatus @default(ACTIVE)
  
  projectId   String
  project     Project      @relation(fields: [projectId], references: [id])
  
  decisions   Decision[]
}

model Decision {
  id          String         @id @default(uuid())
  title       String
  rationale   String         @db.Text
  status      DecisionStatus @default(PROPOSED)
  
  intentId    String
  intent      Intent         @relation(fields: [intentId], references: [id])
  
  authorId    String
  author      User           @relation(fields: [authorId], references: [id])
  
  tasks       Task[]
}

model Task {
  id                String     @id @default(uuid())
  title             String
  status            TaskStatus @default(TODO)
  problemStatement  String     @db.Text
  expectedOutcome   String     @db.Text // Text description of what is expected
  
  decisionId        String
  decision          Decision   @relation(fields: [decisionId], references: [id], onDelete: Restrict) 
  // onDelete: Restrict ensures Decision cannot be deleted if Tasks exist (Rule #2)
  
  assigneeId        String?
  assignee          User?      @relation(fields: [assigneeId], references: [id])
  
  outcome           Outcome?
}

model Outcome {
  id        String   @id @default(uuid())
  metrics   String?  @db.Text
  success   Boolean  @default(false)
  notes     String?
  createdAt DateTime @default(now())
  
  taskId    String   @unique // 1:1 Relation
  task      Task     @relation(fields: [taskId], references: [id])
}
```

## 4. Constraint Enforcement Strategy

1.  **"Task cannot be Done without Outcome"**:
    *   **Database**: Not directly enforceable by a simple check (Task status vs Outcome existence) without triggers.
    *   **Backend**: We will enforce this in the Service layer. When calling `updateTaskStatus(DONE)`, the code will check `prisma.outcome.find unique({ where: { taskId } })`. If null, throw error.

2.  **"Decision cannot be deleted if tasks depend on it"**:
    *   **Database**: Handled by `@relation(onDelete: Restrict)` on the `Task.decisionId` field. Postgres will reject the specific DELETE SQL command.

3.  **"Tasks must have problem_statement..."**:
    *   **Database**: Handled by `String` type (not `String?`) in Prisma, which maps to `NOT NULL` in Postgres.

4.  **"Only managers can create Decisions"**:
    *   **Backend**: Enforced in the API route / Middleware. `if (req.user.role !== 'MANAGER') throw Forbidden`.
