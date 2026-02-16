# Clarity: Project Module Design

## 1. Concept: The "Scope Container"
Projects are the root containers for all work. They enforce **isolation**.
-   **Why it matters**: In real teams, "Marketing" and "Engineering" have different Intents. Mixing them creates noise. Projects enforce strict boundaries.
-   **Philosophy**: "If it doesn't belong to a Project, it doesn't exist."

## 2. Authorization Rules (RBAC)
| Action | Role Required | Logic |
| :--- | :--- | :--- |
| **Create Project** | **MANAGER** | Only leaders define new workstreams. |
| **Update Project** | **MANAGER** | Renaming/Archiving is a scope change. |
| **Delete Project** | **MANAGER** | Destructive. |
| **List Projects** | **MEMBER+** | Visibility is open (Transparency). |
| **View Project** | **MEMBER+** | Everyone needs context. |

## 3. REST API Routes (`/projects`)

### `POST /`
-   **Header**: `Authorization: Bearer <token>` (managed via cookie in our design)
-   **Body**: `{ name: string, description?: string }`
-   **Logic**:
    1.  Check if user.role == 'MANAGER'.
    2.  Validate name length > 0.
    3.  Create via Prisma.
-   **Response**: `201 Created` - `{ project: { id, name, ... } }`

### `GET /`
-   **Logic**: Retrieve all projects.
-   **Response**: `200 OK` - `{ projects: [...] }`

### `GET /:id`
-   **Logic**:
    1.  Find project by ID.
    2.  Include recent Intents (optional, for dashboard).
-   **Error**: `404 Not Found` if invalid ID.

### `PUT /:id`
-   **Role**: **MANAGER**
-   **Body**: `{ name?, description? }`
-   **Logic**: Update fields.

### `DELETE /:id`
-   **Role**: **MANAGER**
-   **Logic**:
    1.  Check for dependent Intents.
    2.  If has Intents -> **Block Delete** (or cascade if we decide to be aggressive, but Clarity philosophy prefers blocking to prevent accidental data loss). -> *Decision: Block if not empty.*

## 4. Service Layer Logic (`ProjectService`)
-   `create(data, user)`: Encapsulates the DB call.
-   `list()`: Returns basic set.
-   `getById(id)`: Returns detail.

## 5. Error Handling
-   `401 Unauthorized`: No token.
-   `403 Forbidden`: Member trying to Create/Edit/Delete.
-   `400 Bad Request`: Missing name.
-   `409 Conflict`: Project name duplicate (optional constraint).
