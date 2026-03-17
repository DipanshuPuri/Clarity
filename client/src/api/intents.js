const API_BASE_URL = 'http://localhost:3000';

/**
 * Intents API Service
 * 
 * Enforces the primary 'Why' layer of the Clarity hierarchy.
 */
export const intentsApi = {
    /**
     * Fetch all intents for a project
     */
    getIntents: async (projectId) => {
        const url = projectId && projectId !== 'undefined'
            ? `${API_BASE_URL}/api/intents?projectId=${projectId}`
            : `${API_BASE_URL}/api/intents`;

        const response = await fetch(url, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to synchronize intents');
        return response.json();
    },

    /**
     * Create a new intent
     */
    createIntent: async (projectId, title, assumption, successSignal) => {
        const response = await fetch(`${API_BASE_URL}/api/intents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ projectId, title, assumption, successSignal })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to initialize intent');
        }
        return response.json();
    }
};
