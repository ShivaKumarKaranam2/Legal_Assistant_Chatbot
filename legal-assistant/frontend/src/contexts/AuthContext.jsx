import React, { createContext, useContext, useState } from 'react';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const login = async (username, password) => {
        try {
            const response = await loginUser(username, password);
            setUser(response.user);
            setToken(response.token);
            localStorage.setItem('token', response.token);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    };

    const signup = async (username, password) => {
        try {
            const response = await signupUser(username, password);
            setUser(response.user);
            setToken(response.token);
            localStorage.setItem('token', response.token);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Signup failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};