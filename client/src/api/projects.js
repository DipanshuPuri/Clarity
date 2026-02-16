/**
 * Projects API Service
 * 
 * Handles project-related HTTP requests.
 */

const API_BASE_URL = 'http://localhost:3000';

/**
 * Helper to handle fetch errors consistently
 * (Duplicated from auth.js to avoid modifying that file for exports)
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const projectsApi = {
    /**
     * Fetch all projects
     * @returns {Promise<Array>} List of projects
     */
    getProjects: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Fetch projects failed:', error);
            throw error;
        }
    },

    /**
     * Fetch a single project by ID
     * @param {string} id 
     * @returns {Promise<Object>} Project details
     */
    getProjectById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Fetch project ${id} failed:`, error);
            throw error;
        }
    },

    /**
     * Create a new project
     * @param {string} name 
     * @param {string} problemStatement 
     * @param {string} successDefinition 
     * @returns {Promise<Object>} Created project
     */
    createProject: async (name, problemStatement, successDefinition) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, problemStatement, successDefinition }),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Create project failed:', error);
            throw error;
        }
    }
};
