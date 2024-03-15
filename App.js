import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Root from "./src/screens/Root";
import Home from "./src/screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigation";
import { Provider as PaperProvider, Provider } from "react-native-paper";

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <StatusBar
          style="dark"
          translucent
          animated
          backgroundColor="transparent"
        />
        <RootStack />
      </NavigationContainer>
    </Provider>
  );
}
