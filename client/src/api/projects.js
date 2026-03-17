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
        // Throw object with status to allow specific handling (e.g. 403 Forbidden)
        throw { message: errorMessage, status: response.status };
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
     * @param {Object} projectData
     * @returns {Promise<Object>} Created project
     */
    createProject: async (projectData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(projectData),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Create project failed:', error);
            throw error;
        }
    },

    updateProject: async (id, projectData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(projectData),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Update project failed:', error);
            throw error;
        }
    },

    deleteProject: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Delete project ${id} failed:`, error);
            throw error;
        }
    },

    assignMember: async (id, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects/${id}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Assign member failed:', error);
            throw error;
        }
    }
};
