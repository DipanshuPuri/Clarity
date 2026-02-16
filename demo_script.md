# Clarity: Demo Script

## Opening Hook
"Everyone currently uses Jira to track *what* they are doing. But nobody tracks *why*. Clarity is the system of record for technical context."

## Scene 1: The Architect (Defining the Why)
1.  **Login** as Manager.
2.  **Create Project**: "Core Engine Rewrite".
3.  **Create Intent**: "Reduce API Latency by 50%".
4.  *Narrative*: "This isn't a ticket. It's a goal. It organizes everything that follows."

## Scene 2: The Decision (The Strategy)
1.  **Create Decision** (linked to Intent): "Migrate Session Store to Redis".
2.  *Narrative*: "Before assigning tasks, we agree on the strategy. Now, every junior engineer knows *why* they are installing Redis."

## Scene 3: The Work (Execution)
1.  **View Task Board**.
2.  **Create Task** (linked to Intent): "Provision Redis Cluster".
3.  *Narrative*: "The task is standard. But look at the context—it's permanently linked to the Intent."

## Scene 4: The Closing Loop (Outcome)
1.  **Try to Mark Done**: Show that you can't just drag it to Done (conceptually, or if UI blocked it).
2.  **Click 'Close Loop'**: Open Outcome Modal.
3.  **Enter Result**: "Latency dropped to 40ms (Success)".
4.  **Submit**: Task auto-moves to Done.
5.  *Closer*: "We didn't just ship code. We validated the hypothesis."
