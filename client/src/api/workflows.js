const API_BASE_URL = 'http://localhost:3000';

const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            errorMessage = response.statusText;
        }
        throw { message: errorMessage, status: response.status };
    }
    if (response.status === 204) return null;
    return response.json();
};

export const workflowApi = {
    create: async (data) => {
        const response = await fetch(`${API_BASE_URL}/api/workflows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    getByProject: async (projectId) => {
        const response = await fetch(`${API_BASE_URL}/api/workflows/project/${projectId}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        return handleResponse(response);
    },
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/api/workflows/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        return handleResponse(response);
    },
    update: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/api/workflows/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/api/workflows/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        return handleResponse(response);
    }
};
