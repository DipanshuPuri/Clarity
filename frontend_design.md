# Clarity: Frontend Design System

## 1. Visual Foundation
**Philosophy**: "Dense, Data-Rich, No Distractions."
This is a tool for engineers. It should look like an IDE or a Flight HUD, not a marketing site.

### Color Palette
-   **Primary (Brand/Dark)**: `#0E1116` (Used for Sidebar, Headers, Heavy Text)
-   **Secondary (Accent)**: `#2EC4C6` (Teal - Used for Primary Actions, Active States)
-   **Background**: `#F5F7FA` (Light Gray - Application Canvas)
-   **Surface**: `#FFFFFF` (Cards, Panels)
-   **Border**: `#E2E8F0` (Subtle dividers)
-   **Error**: `#EF4444` (Red 500)
-   **Success**: `#10B981` (Green 500)

### Typography
-   **Font**: System Sans-Serif (Inter preferred if installed, otherwise system-ui).
-   **Scale**:
    -   `h1`: 24px Bold (Page Titles)
    -   `h2`: 20px SemiBold (Section Headers)
    -   `body`: 14px Regular (Standard Text)
    -   `small`: 12px Medium (Metadata, Badges)

## 2. Global Layout
**"The Workbench"**
-   **Left Sidebar (Fixed, 240px)**:
    -   Logo (Top)
    -   Navigation (Projects, My Tasks, Reports)
    -   User Profile (Bottom)
    -   *bg-primary text-white*
-   **Top Bar (Height 64px)**:
    -   Breadcrumbs (`Projects / Core Engine / Intent: Optimizations`)
    -   Context Actions (Create Button)
    -   *bg-white border-b*
-   **Main Content**:
    -   Padded area (32px)
    -   Allows scrolling.

## 3. Core Component Styles
-   **Button**:
    -   `Primary`: bg-secondary text-white font-medium hover:brightness-110 rounded-md px-4 py-2.
    -   `Secondary`: border border-gray-300 text-gray-700 hover:bg-gray-50.
-   **Card**:
    -   bg-white border border-gray-200 shadow-sm rounded-lg.
    -   No hover lift (No gimmicks).
-   **Badge**:
    -   `px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider`.
    -   *Intent*: `bg-purple-100 text-purple-700`
    -   *Decision*: `bg-blue-100 text-blue-700`
    -   *Outcome*: `bg-green-100 text-green-700`

## 4. Page Layouts

### Kanban Board (`/projects/:id`)
-   **Header**: Project Title + Stats.
-   **Board**: Horizontal overflow.
    -   **Columns**: TODO, IN PROGRESS, DONE.
    -   **Task Card**:
        -   Top: Context Line (Intent Title - Truncated).
        -   Middle: Task Title.
        -   Bottom: Assignee Avatar + Decision Link Icon.

### Task Detail (`/tasks/:id`)
-   **Two-Column Layout**:
    -   **Left (70%) - The Context**:
        -   *Intent Box*: "Why are we doing this?" (Read-only reference).
        -   *Decision Box*: "How did we decide?" (Read-only reference).
        -   *Task Info*: Problem Statement, Expected Outcome (Editable).
    -   **Right (30%) - The Meta**:
        -   Status Dropdown (Big).
        -   Assignee.
        -   "Close Loop" Button (Triggers Outcome Modal).
