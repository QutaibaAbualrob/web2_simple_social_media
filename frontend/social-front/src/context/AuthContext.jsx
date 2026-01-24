import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on startup
        const token = localStorage.getItem('token');
        if (token) {
            // Typically you'd verify the token with an endpoint like /auth/me
            // For now, let's assume valid or try to fetch profile
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/users/me');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            logout(); // Invalid token
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, ...userData } = response.data;
        localStorage.setItem('token', token);
        // The response has minimal user data, let's use what we have or fetch full profile
        // The DTO returns Name, Username, UserId
        setUser({
            userId: response.data.userId,
            username: response.data.username,
            name: response.data.name
        });
        // Optionally fetch full profile to get Bio/Pic
        await fetchUserProfile();
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        const { token } = response.data;
        localStorage.setItem('token', token);
        await fetchUserProfile();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
