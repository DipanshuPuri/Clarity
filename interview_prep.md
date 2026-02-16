# Clarity: Interview Preparation & Technical Deep Dive

## 1. The Core Differentiator (Why not Jira?)
*   **Jira is Output-focused**: It measures velocity (tickets closed per sprint).
*   **Clarity is Outcome-focused**: It measures validity (did the Intent succeed?).
*   **The "Orphan" Problem**: In Jira, you find a ticket "Update config" created 6 months ago. You have no idea *why*. In Clarity, that task is inextricably linked to an Intent. You can walk the tree up: Task -> Decision -> Intent.

## 2. Technical Architecture
*   **Transactions**: Explain the `Outcome` creation. "We use a Prisma Transaction to ensure atomicity. Creating an Outcome and updating the Task status happen together. This guarantees data integrity—no 'Done' tasks without proof."
*   **RBAC**: "We implemented strict Role-Based Access Control. Only Managers create Strategy (Intents/Decisions). This aligns the tool with organizational hierarchy."
*   **Docker**: "The backend is containerized (Alpine Node image) for consistent deployment."

## 3. Database Design Choices
*   **Relational vs NoSQL**: "We chose PostgreSQL because the data is highly structured and relational. The lineage (Intent -> Decision -> Task) is rigid. A document store would allow data to drift (orphaned tasks), which violates our core philosophy."
*   **Strict Deletion**: "We use `onDelete: Restrict`. You cannot delete a Decision if Tasks depend on it. This preserves history."

## 4. Code Highlight (The "Rule Check")
(Show them `server/src/services/outcomeService.js`)
```javascript
return await prisma.$transaction(async (tx) => {
    // 1. Verify constraints
    if (task.status === 'DONE') throw new Error('Already Done');
    // 2. Create Proof
    await tx.outcome.create({ ... });
    // 3. Update Status
    await tx.task.update({ ...status: 'DONE'... });
});
```
*Narrative*: "This routine enforces our business philosophy at the database level."
