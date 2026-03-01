import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('hms_token'));
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('hms_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            localStorage.removeItem('hms_user');
            return null;
        }
    });

    const setTokenManually = (newToken, userData) => {
        localStorage.setItem('hms_token', newToken);
        localStorage.setItem('hms_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('hms_token');
        localStorage.removeItem('hms_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, setTokenManually, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};