// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        const loadUserFromStorage = () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (storedToken && storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setToken(storedToken);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error al cargar datos de usuario:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        loadUserFromStorage();
    }, []);

    // --- REGISTRO: Ahora espera que el servidor envíe un correo ---
    const register = useCallback(async (username, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            
            if (!response.ok) { throw new Error(data.message || 'Error en el registro'); }
            
            // Si el backend responde bien, significa que el correo fue enviado
            return { 
                success: true, 
                message: data.message || 'Código enviado a tu correo.',
                email // Retornamos el email para usarlo en la pantalla de verificación
            };
        } catch (error) {
            console.error('Error al registrar:', error);
            return { success: false, message: error.message };
        }
    }, [API_BASE_URL]);

    // --- NUEVA FUNCIÓN: Verificar el Token enviado al correo ---
    const verifyEmailToken = useCallback(async (email, code) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
            const data = await response.json();

            if (!response.ok) { throw new Error(data.message || 'Código inválido'); }

            // Si la verificación es exitosa, el usuario queda autenticado automáticamente
            setToken(data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return { success: true, message: 'Cuenta verificada con éxito' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }, [API_BASE_URL]);

    const login = useCallback(async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.message || 'Error en el inicio de sesión'); }

            setToken(data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }, [API_BASE_URL]);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const authContextValue = {
        user,
        token,
        isAuthenticated,
        loading,
        register,
        verifyEmailToken, // <--- EXPORTADA
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};