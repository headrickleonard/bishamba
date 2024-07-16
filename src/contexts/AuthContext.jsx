import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        // Check if access token exists in local storage on app startup
        const fetchAccessToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('accessToken');
                if (storedToken) {
                    setAccessToken(storedToken);
                }
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        };

        fetchAccessToken();
    }, []);

    const storeAccessToken = async (token) => {
        try {
            await AsyncStorage.setItem('accessToken', token);
            setAccessToken(token);
        } catch (error) {
            console.error('Error storing access token:', error);
        }
    };

    const clearAccessToken = async () => {
        try {
            await AsyncStorage.removeItem('accessToken');
            setAccessToken(null);
        } catch (error) {
            console.error('Error clearing access token:', error);
        }
    };

    const login = async (accessToken) => {
        try {
            await storeAccessToken(accessToken);
            // Additional login logic if needed
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = async () => {
        try {
            await clearAccessToken();
            // Additional logout logic if needed
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
