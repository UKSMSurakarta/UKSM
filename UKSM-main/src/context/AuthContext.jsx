import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginApi, getMeApi, logoutApi } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await getMeApi();
            if (response.success) {
                setUser(response.data);
                setIsAuthenticated(true);
            } else {
                handleLocalLogout();
            }
        } catch (error) {
            handleLocalLogout();
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLocalLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const login = async (email, password) => {
        try {
            const response = await loginApi(email, password);
            if (response.success) {
                const { access_token, user: userData } = response.data;
                localStorage.setItem('token', access_token);
                setToken(access_token);
                setUser(userData);
                setIsAuthenticated(true);
                return { success: true, role: userData.role };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
        } finally {
            handleLocalLogout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
