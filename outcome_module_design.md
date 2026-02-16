# Clarity: Outcome Module Design

## 1. Concept: The Feedback Loop
In most systems, moving a task to "Done" is a relief. In **Clarity**, it's a moment of truth.
-   **Why critical?**: We claimed an Intent (Goal) and a Decision (Strategy). The Outcome validates if we were right.
-   **Behavior Change**: Teams stop celebrating "Shipping" and start celebrating "Solving".

## 2. Fields & Validation
-   **TaskId**: Unique Link (Required).
-   **Result**: Enum (SUCCESS, PARTIAL, FAILED).
    -   *Success*: Worked as expected.
    -   *Partial*: Solved intent but with side effects/caveats.
    -   *Failed*: Did not solve the intent. (This is OK! We learned).
-   **Notes**: String (Required). Reflection on why.

## 3. The "Done" Transaction
To enforce "Task Done REQUIRES Outcome":
-   We rarely call `PUT /tasks/:id` to set status to DONE directly (or if we do, it fails).
-   Instead, we create the Outcome, and the *System* marks the Task as DONE.
-   **API**: `POST /outcomes`
    -   Body: `{ taskId, result, notes }`
    -   **Backend Logic**:
        ```javascript
        prisma.$transaction([
          prisma.outcome.create({ ... }),
          prisma.task.update({ where: {id: taskId}, data: { status: 'DONE' } })
        ])
        ```

## 4. REST API Routes (`/outcomes`)

### `POST /`
-   **Body**: `{ taskId, success (bool maps to result enum?), notes }`
-   **Logic**: Run the transaction to close the loop.

### `GET /:id`
-   Access to the lesson learned.
