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

export default function App() {
  const [isConnected, setIsConnected] = useState(true);

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
  
  return (
    <Provider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar
            style="dark"
            translucent
            animated
            backgroundColor="transparent"
          />
          <BottomTabs />
          {/* <RootStack /> */}
          {/* <RootNavigation/> */}
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}
