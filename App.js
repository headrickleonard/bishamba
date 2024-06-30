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

export default function App() {
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
