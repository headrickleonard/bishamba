import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import React from "react";
import { Image, StyleSheet, View ,Platform} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomHeader from "../components/CustomHeader";
import { transition } from "../config";
import AccountScreen from "../screens/Account";
import AskCommunity from "../screens/AskCommunity";
import Auth from "../screens/Auth";
import ScanScreen from "../screens/Camera";
import PlantScanner from "../screens/PlantScanner";
import ScanHistory from "../screens/ScanHistory";
import Threads from "../screens/Threads";
import DiseaseDetails from "./../screens/DiseaseDetails";
import CustomTabBar from "./CustomTabBar";
import RootStack from "./index";
import Details from "../screens/Details";

const Tab = createBottomTabNavigator();
const ScanStack = createStackNavigator();
const DiagnoseStack = createStackNavigator();

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
    <ScanStack.Screen name="Auth" component={Auth} options={transition} />
    <DiagnoseStack.Screen name="Details" component={Details}  options={transition}/>

  </ScanStack.Navigator>
);
const DiagnoseStackScreen = () => (
  <DiagnoseStack.Navigator screenOptions={{ headerShown: false }}>
    <DiagnoseStack.Screen name="Diagnose" component={ScanHistory} />
    <DiagnoseStack.Screen
      name="DiseaseDetails"
      component={DiseaseDetails}
      options={transition}
    />
    <DiagnoseStack.Screen name="Details" component={Details}  options={transition}/>
  </DiagnoseStack.Navigator>
);
const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
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
        tabBarStyle: { 
          height: 60,
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fallback color
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              tint="light"
              intensity={80}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]} />
          )
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
        component={DiagnoseStackScreen}
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
