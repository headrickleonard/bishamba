import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Root from "./src/screens/Root";
import Home from "./src/screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigation";
import { Provider as PaperProvider, Provider } from "react-native-paper";
import RootNavigation from "./src/navigation/RootNavigation";
import BottomTabs from "./src/navigation/BottomTabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NetInfo from '@react-native-community/netinfo';
import NoInternetScreen from './src/screens/NoInternetScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/AuthContext';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);
  const checkConnection = () => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return <NoInternetScreen retryConnection={checkConnection} />;
  }
  if (isFirstLaunch === null) {
    return null; // Render a loading screen or nothing while checking AsyncStorage
  }

  return (
    <AuthProvider>
      <Provider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <StatusBar
              style="dark"
              translucent
              animated
              backgroundColor="transparent"
            />
            {isFirstLaunch ? (
              <Stack.Navigator>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MainApp" component={BottomTabs} options={{ headerShown: false }} />
              </Stack.Navigator>
            ) : (
              <BottomTabs />
            )}
            {/* <BottomTabs /> */}
            {/* <RootStack /> */}
            {/* <RootNavigation/> */}
          </NavigationContainer>
        </GestureHandlerRootView>
        <Toast
          position='top'
          topOffset={28}
        />
      </Provider>
    </AuthProvider>
  );
}
