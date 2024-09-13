import React, { createContext, useContext, useState, useEffect } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AchievementModal from "../components/AchievementModal";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [startTime, setStartTime] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [currentLevel, setCurrentLevel] = useState("");

  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedToken) {
          setAccessToken(storedToken);
        }
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error("Error fetching stored data:", error);
      }
    };

    fetchStoredData();
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

        const currentCategory = getCategory();
        if (currentCategory !== getCategory(totalTimeSpent)) {
          setCurrentLevel(currentCategory);
          setShowDialog(true);
        }
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

  const storeUserData = async (data) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(data));
      setUserData(data);
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const clearStoredData = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("userData");
      setAccessToken(null);
      setUserData(null);
    } catch (error) {
      console.error("Error clearing stored data:", error);
    }
  };

  const login = async (loginData) => {
    try {
      if (!loginData || !loginData.data) {
        throw new Error("Login data is invalid.");
      }
      await storeAccessToken(loginData.data.accessToken);
      await storeUserData(loginData.data.userData);
    } catch (error) {
      console.error("Login error:", error);
      // Handle error appropriately, e.g., show an error message
    }
  };

  const logout = async () => {
    try {
      await clearStoredData();
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
        userData,
        login,
        logout,
        totalTimeSpent: formatTime(totalTimeSpent),
        category: getCategory(),
      }}
    >
      {children}
      <AchievementModal
        isVisible={showDialog}
        onClose={() => setShowDialog(false)}
        level={currentLevel}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
