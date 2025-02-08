import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
export const AuthContext = createContext();


import { SERVER, PORT } from '../../_CONST_';

const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/geographic-information-sy/backend/v1';

// Provider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState('');
    const [isBuyer, setIsBuyer] = useState('');




    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/check-session/`, { withCredentials: true });
                setIsLoggedIn(response.data.isLoggedIn);
                setUserId(response.data.user_id);
                setEmail(response.data.email);
                setIsBuyer(response.data.is_buyer)
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, email, setIsLoggedIn, isBuyer }}>
            {children}
        </AuthContext.Provider>
    );
};