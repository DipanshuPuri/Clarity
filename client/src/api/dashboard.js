import { API_BASE_URL } from './auth';

export const dashboardApi = {
    getDashboardData: async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        return response.json();
    },
    getActiveDecisions: async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard/active-decisions`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch active decisions');
        return response.json();
    },
    getReflectionRequired: async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard/reflection-required`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch reflection requirements');
        return response.json();
    },
    getRecentLearnings: async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard/recent-learnings`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch recent learnings');
        return response.json();
    },
    getOnboardingStatus: async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard/onboarding-status`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch onboarding status');
        return response.json();
    }
};
