import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                const data = await authApi.getCurrentUser();
                setUser(data.user);
            } catch (err) {
                // Not logged in or expired
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    const login = async (email, password) => {
        const data = await authApi.login(email, password);
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };

    const signup = async (userData) => {
        const data = await authApi.signup(userData);
        setUser(data.user);
        return data.user;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
