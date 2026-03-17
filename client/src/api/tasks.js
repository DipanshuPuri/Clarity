const API_BASE_URL = 'http://localhost:3000';

/**
 * Tasks API Service
 * 
 * Enforces the 'How' layer of the Clarity hierarchy.
 * Tasks must be tied to a Decision (the strategy).
 */
export const tasksApi = {
    /**
     * Fetch tasks with optional filters
     * filters: { decisionId, intentId, assigneeId }
     */
    getTasks: async (filters = {}) => {
        // Remove 'undefined' strings or null/undefined values
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== 'undefined')
        );
        const queryParams = new URLSearchParams(cleanFilters).toString();
        const response = await fetch(`${API_BASE_URL}/api/tasks?${queryParams}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to synchronize task queue');
        return response.json();
    },

    /**
     * Create a new task
     */
    createTask: async (decisionId, title, executionDescription, expectedOutcome) => {
        const response = await fetch(`${API_BASE_URL}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ decisionId, title, executionDescription, expectedOutcome })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to initialize execution unit');
        }
        return response.json();
    }
};
