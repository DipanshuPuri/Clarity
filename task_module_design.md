# Clarity: Task Module Design

## 1. Schema Updates
To support "Optional Linked Decision":
-   **Task** now links directly to **Intent** (Required).
-   **Task** links to **Decision** (Optional).
-   *Why?* Allows execution of work that is obvious enough to not need a full Decision record, while still tracking "Why" (Intent).

## 2. Fields & Validation
-   **Title**: String (Req)
-   **Problem Statement**: String (Req) - "The Intent Description"
-   **Expected Outcome**: String (Req)
-   **Status**: `TODO` -> `IN_PROGRESS` -> `DONE`
-   **Due Date**: DateTime (Opt)
-   **Assignee**: FK User (Req?) -> Let's make Optional initially.

## 3. Transition Rules (The Business Logic)
1.  `TODO` -> `IN_PROGRESS`: Open to all.
2.  `IN_PROGRESS` -> `DONE`:
    -   **Constraint**: Must have a linked **Outcome** record?
    -   *Wait*, the prompt says "Cannot mark Done without Outcome".
    -   Since Outcome is a separate API / entity, we can enforces this Check: `count(outcomes) > 0`.
    -   *Alternative*: Client creates Outcome *simultaneously* or just before.
    -   *Implementation*: `if (status === 'DONE') { const outcome = await prisma.outcome.find...; if (!outcome) throw Error; }`

## 4. REST API Routes (`/tasks`)

### `POST /`
-   **Body**: `{ intentId, decisionId?, title, problemStatement, expectedOutcome, dueDate?, assigneeId? }`
-   **Logic**: Validate Intent exists.

### `PUT /:id`
-   **Body**: Update fields.
-   **Status Change Logic**: If `status` is becoming `DONE`, trigger the Outcome Check.

### `GET /`
-   Filter by `intentId`, `decisionId`, `assigneeId`.

### `DELETE /:id`
-   Standard delete.
