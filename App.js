import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Root from "./src/screens/Root";
import Home from "./src/screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigation";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar
        style="dark"
        translucent
        animated
        backgroundColor="transparent"
      />

      <RootStack />
    </NavigationContainer>
  );
}
