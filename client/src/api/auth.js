/**
 * Auth API Service
 * 
 * Handles all authentication-related HTTP requests using native fetch.
 * Enforces 'credentials: include' to ensure HttpOnly cookies are sent/received.
 */

export const API_BASE_URL = 'http://localhost:3000';

/**
 * Helper to handle fetch errors consistently
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            // Could not parse JSON error response, stick to status text
            errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
    }

    // Return null for 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const authApi = {
    /**
     * Signup user
     * @param {Object} userData 
     * @returns {Promise<Object>} User object
     */
    signup: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    },
    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} User object
     */
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important: Receive HttpOnly cookie
                body: JSON.stringify({ email, password }),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    /**
     * Logout user
     * @returns {Promise<void>}
     */
    logout: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include', // Important: Send cookie to clear it
            });
            await handleResponse(response);
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    },

    /**
     * Get current authenticated user
     * @returns {Promise<Object|null>} User object or null if not authenticated
     */
    getCurrentUser: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                credentials: 'include', // Important: Send cookie for verification
            });

            if (response.status === 401 || response.status === 403) {
                return null;
            }

            return await handleResponse(response);
        } catch (error) {
            console.error('Get current user failed:', error);
            return null;
        }
    }
};
