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

export const ticketsApi = {
    createTicket: async (ticketData) => {
        const response = await fetch(`${API_BASE_URL}/api/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(ticketData),
        });
        return handleResponse(response);
    },

    updateTicket: async (id, ticketData) => {
        const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(ticketData),
        });
        return handleResponse(response);
    },

    deleteTicket: async (id) => {
        const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        return handleResponse(response);
    }
};
