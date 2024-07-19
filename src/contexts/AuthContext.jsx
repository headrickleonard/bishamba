import React, { createContext, useContext, useState, useEffect } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [startTime, setStartTime] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  useEffect(() => {
    // Check if access token exists in local storage on app startup
    const fetchAccessToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");
        if (storedToken) {
          setAccessToken(storedToken);
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    const loadTotalTimeSpent = async () => {
      const storedTotalTime = await AsyncStorage.getItem("totalTimeSpent");
      if (storedTotalTime) {
        setTotalTimeSpent(parseInt(storedTotalTime, 10));
      }
    };

    loadTotalTimeSpent();
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // App has come to the foreground
        setStartTime(new Date());
      } else if (
        appState === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        // App has gone to the background
        const endTime = new Date();
        const timeSpent = endTime - startTime;
        const totalTime = totalTimeSpent + timeSpent;
        setTotalTimeSpent(totalTime);
        await AsyncStorage.setItem("totalTimeSpent", totalTime.toString());
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [appState, startTime, totalTimeSpent]);

  const storeAccessToken = async (token) => {
    try {
      await AsyncStorage.setItem("accessToken", token);
      setAccessToken(token);
    } catch (error) {
      console.error("Error storing access token:", error);
    }
  };

  const clearAccessToken = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      setAccessToken(null);
    } catch (error) {
      console.error("Error clearing access token:", error);
    }
  };

  const login = async (accessToken) => {
    try {
      if (!accessToken) {
        throw new Error("Access token is null or undefined.");
      }
      await storeAccessToken(accessToken);
    } catch (error) {
      console.error("Login error:", error);
      // Handle error appropriately, e.g., show an error message
    }
  };

  const logout = async () => {
    try {
      await clearAccessToken();
      // Additional logout logic if needed
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getCategory = () => {
    const hoursSpent = totalTimeSpent / (1000 * 60 * 60);
    if (hoursSpent < 1) return "Novice";
    if (hoursSpent < 5) return "Intermediate";
    if (hoursSpent < 20) return "Advanced";
    if (hoursSpent < 50) return "Expert";
    return "Master";
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
        totalTimeSpent: formatTime(totalTimeSpent),
        category: getCategory(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
