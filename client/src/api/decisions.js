const API_BASE_URL = 'http://localhost:3000';

/**
 * Decisions API Service
 * 
 * Enforces the 'What' layer of the Clarity hierarchy.
 * Decisions are the bridge between Intent (Why) and Task (How).
 */
export const decisionsApi = {
    /**
     * Fetch all decisions for an intent
     */
    getDecisions: async (intentId) => {
        const response = await fetch(`${API_BASE_URL}/api/decisions?intentId=${intentId}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to synchronize decisions');
        return response.json();
    },

    /**
     * Create a new decision
     */
    createDecision: async (intentId, title, chosenOption, rationale, rejectedAlternatives) => {
        const response = await fetch(`${API_BASE_URL}/api/decisions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ intentId, title, chosenOption, rationale, rejectedAlternatives })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to record decision');
        }
        return response.json();
    }
};
