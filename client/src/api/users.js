import { API_BASE_URL } from './auth';

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
    return response.json();
};

export const usersApi = {
    getUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'GET',
            credentials: 'include'
        });
        return await handleResponse(response);
    }
};
