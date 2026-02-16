# Clarity: Decision Module Design

## 1. Concept: First-Class Strategy
In most tools (Jira), a "Decision" is a comment on a ticket or a Confluence page nobody reads.
In **Clarity**, a **Decision** is a parent entity.
-   **Philosophy**: You cannot write code (Task) until you know *why* (Decision).
-   **Jira vs Clarity**:
    -   *Jira*: "Task 101: Add Redis" -> Status: Done. (Context lost).
    -   *Clarity*: "Decision: Use Redis for Session Store" -> "Task: Provision Cluster". (Lineage preserved).

## 2. Authorization Rules (RBAC)
| Action | Role Required | Logic |
| :--- | :--- | :--- |
| **Create Decision** | **MANAGER** | Defining strategy is a leadership responsibility. |
| **Update Decision** | **MANAGER** | Changing the "Why" requires approval. |
| **Delete Decision** | **MANAGER** | **Strictly Blocked** if tasks exist. |
| **View Decision** | **MEMBER+** | Engineers must see the rationale. |

## 3. Validation Logic
-   **Status**: Can be `PROPOSED`, `APPROVED`, `REJECTED`.
-   **Immutability**: Once `APPROVED`, the `rationale` should ideally be locked (or versioned), but for V1 we allows edits by Managers.
-   **Task Linkage**:
    -   Prompt mentioned "Tasks can *optionally* link".
    -   **Design Decision**: We will enforce **Strict Linkage (Required)** in V1 to satisfy the "Context-First" vision and "No Orphans" rule. "Optional" linking weakens the system to become just another Todo list.

## 4. REST API Routes (`/decisions`)

### `POST /`
-   **Role**: **MANAGER**
-   **Body**: `{ intentId, title, rationale, status? }`
-   **Logic**:
    1.  Verify `intentId` exists.
    2.  Set `authorId` from checks.
-   **Response**: `201 Created`.

### `GET /?intentId=...`
-   **Logic**: List decisions, optionally filter by Intent.

### `GET /:id`
-   **Logic**: Get details + list of linked Tasks.

### `PUT /:id`
-   **Role**: **MANAGER**
-   **Logic**: Update title, rationale, status.

### `DELETE /:id`
-   **Role**: **MANAGER**
-   **Logic**: Check for tasks. If count > 0, THROW ERROR.
