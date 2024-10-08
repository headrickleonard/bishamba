import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from "expo-status-bar";
import * as Updates from 'expo-updates';
import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-native-paper";
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import BottomTabs from './src/navigation/BottomTabs';
import NoInternetScreen from './src/screens/NoInternetScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import i18n from './src/translations/i18n';

const Stack = createStackNavigator();

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  // Check for initial app launch
  useEffect(() => {
    const checkFirstLaunch = async () => {
      const value = await AsyncStorage.getItem('alreadyLaunched');
      if (value == null) {
        await AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  // Check internet connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Check for app updates
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          Alert.alert(
            'Update Available',
            'A new update is available. Do you want to update now?',
            [
              {
                text: 'Later',
                style: 'cancel'
              },
              {
                text: 'Update',
                onPress: async () => {
                  try {
                    await Updates.fetchUpdateAsync();
                    Alert.alert('Update Installed', 'The app will now reload with the latest update.');
                    Updates.reloadAsync();
                  } catch (e) {
                    Alert.alert('Update Error', 'Failed to update the app.');
                  }
                }
              }
            ]
          );
        }
      } catch (e) {
        console.error('Failed to check for updates:', e);
      }
    };
    checkForUpdates();
  }, []);

  if (!isConnected) {
    return <NoInternetScreen retryConnection={() => NetInfo.fetch().then(state => setIsConnected(state.isConnected))} />;
  }
  if (isFirstLaunch === null) {
    return null; // Render a loading screen or nothing while checking AsyncStorage
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
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
              </NavigationContainer>
            </GestureHandlerRootView>
            <Toast
              position='top'
              topOffset={28}
            />
          </Provider>
        </I18nextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

