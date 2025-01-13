import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState('');




    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/check-session/', { withCredentials: true });
                setIsLoggedIn(response.data.isLoggedIn);
                setUserId(response.data.user_id);
                setEmail(response.data.email);
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, email, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};