import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "../screens/HomeScreen";
import DiagnoseScreen from "../screens/DetailsScreen";
import ScanScreen from "../screens/Camera";
import ShopsScreen from "../screens/Ecommerce";
import AccountScreen from "../screens/Account";
import { Image, View, StyleSheet } from "react-native";
import CustomTabBar from "./CustomTabBar";
import RootStack from "./index";
import { BlurView } from "expo-blur";
import OnboardingScreen from "../screens/OnboardingScreen";
import SocialFeedScreen from "../screens/SocialFeedScreen";
import NoInternetScreen from "../screens/NoInternetScreen";
import TabView from "../components/social/TabView";
import ResultsScreen from "../screens/ResultScreen";

const Tab = createBottomTabNavigator();

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
                    // bottom: 15,
                  }}
                >
                  <Image
                    source={require("../assets/icons/scan.png")}
                    style={[
                      {
                        // tintColor: color,
                        width: size * 1.5,
                        height: size * 1.5,
                      },
                    ]}
                  />
                </View>
              );
              break;
            case "Shops":
              iconName = focused
                ? "comment-quote-outline"
                : "comment-quote-outline";
              break;
            case "Account":
              iconName = focused ? "cog-outline" : "account-outline";
              break;
          }

          // Customize Scan button
          if (route.name === "Scan") {
            return (
              <Icon
                name={iconName}
                size={size * 1.5}
                color={color}
                style={{
                  backgroundColor: "white",
                  borderRadius: size,
                  padding: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 5,
                }}
              />
            );
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
      // backBehavior="history"
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
        // component={DiagnoseScreen}
        component={OnboardingScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Tab.Screen
        name="Shops"
        // component={TabView}
        // component={SocialFeedScreen}
        component={ResultsScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
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
