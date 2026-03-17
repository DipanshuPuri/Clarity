import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/config';

/**
 * RequireAuth - Authentication Guard Component
 * 
 * Optimized to use AuthContext and align with premium aesthetic.
 */
const RequireAuth = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <div className="space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em] block">Security Clearance</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Verifying Credentials...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;
