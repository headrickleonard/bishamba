import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "../screens/HomeScreen";
import DiagnoseScreen from "../screens/DetailsScreen";
import ScanScreen from "../screens/Camera";
import PlantScanner from "../screens/PlantScanner";
import AskCommunity from "../screens/AskCommunity";
import ShopsScreen from "../screens/Ecommerce";
import AccountScreen from "../screens/Account";
import { Image, View, StyleSheet } from "react-native";
import CustomTabBar from "./CustomTabBar";
import RootStack from "./index";
import { BlurView } from "expo-blur";
import Threads from "../screens/Threads";
import CustomHeader from "../components/CustomHeader";
import ScanHistory from "../screens/ScanHistory";
import { transition } from "../config";
import Auth from "../screens/Auth";

const Tab = createBottomTabNavigator();
const ScanStack = createStackNavigator();

const ScanStackScreen = () => (
  <ScanStack.Navigator screenOptions={{ headerShown: false }}>
    <ScanStack.Screen name="Camera" component={ScanScreen} />
    <ScanStack.Screen
      name="PlantScanner"
      component={PlantScanner}
      options={transition}
    />
    <ScanStack.Screen
      name="AskCommunity"
      component={AskCommunity}
      options={transition}
    />
      <ScanStack.Screen
        name="Auth"
        component={Auth}
        options={transition}
      />
  </ScanStack.Navigator>
);

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "leaf" : "leaf-circle";
              break;
            case "Diagnose":
              iconName = focused ? "stethoscope" : "stethoscope";
              break;
            case "Scan":
              return (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: size * 2,
                    height: size * 2,
                    borderRadius: size,
                    backgroundColor: "#32c759",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 5,
                    borderWidth: 2,
                    borderColor: "#02ed58",
                  }}
                >
                  <Image
                    source={require("../assets/icons/scan.png")}
                    style={{
                      width: size * 1.5,
                      height: size * 1.5,
                    }}
                  />
                </View>
              );
            case "Shops":
              iconName = focused
                ? "comment-quote-outline"
                : "comment-quote-outline";
              break;
            case "Account":
              iconName = focused ? "cog-outline" : "account-outline";
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "#010101",
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: { height: 60 },
        tabBarBackground: () => (
          <BlurView
            tint="default"
            intensity={80}
            style={StyleSheet.absoluteFill}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={RootStack}
        options={({ route }) => ({
          tabBarVisible: route.state
            ? !route.state.routes.some((r) => r.name === "Details")
            : true,
          headerShown: false,
          gestureEnabled: true,
        })}
      />
      <Tab.Screen
        name="Diagnose"
        component={ScanHistory}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanStackScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Tab.Screen
        name="Shops"
        component={Threads}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              navigation={navigation}
              title={"Community spaces"}
              showCreateIcon={true}
            />
          ),
          headerStyle: {
            height: 100,
          },
          headerTransparent: true,
        })}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
