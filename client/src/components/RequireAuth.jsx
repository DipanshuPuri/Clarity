import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Loader2 } from 'lucide-react';

/**
 * RequireAuth - Authentication Guard Component
 * 
 * FLOW:
 * 1. Unauthenticated User tries to access /dashboard or /projects
 * 2. RequireAuth calls getCurrentUser() via API
 * 3. If 401/403 -> Redirects to /login
 * 4. If valid user -> Renders children
 * 
 * This enforces: "Unauthenticated users cannot access protected routes"
 */
const RequireAuth = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, false = unauth, true = auth
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await authApi.getCurrentUser();
                if (user) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default RequireAuth;
