import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity,Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Home from './../screens/Home';
import Shop from './../screens/Shop';
import Ecommerce from './../screens/Ecommerce';
import Details from '../screens/Details';

const Tab = createBottomTabNavigator();

const HomeScreen = () => (
  <View style={styles.screenContainer}>
     {[...Array(30).keys()].map(i => (
      <View key={i} style={styles.item}>
        <Text>Item {i + 1}</Text>
      </View>
    ))}
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Profile Screen</Text>
  </View>
);

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customButtonContainer}
    onPress={onPress}
  >
    <View style={styles.customButton}>
      {children}
    </View>
  </TouchableOpacity>
);

const MyTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBar,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Ionicons name="home" size={24} color={focused ? '#6200ee' : '#222'} />
        ),
      }}
    />
    <Tab.Screen
      name="Ecommerce"
      component={HomeScreen} // Change to the actual screen
      options={{
        tabBarIcon: ({ focused }) => (
          <Ionicons name="add-circle" size={48} color={focused ? '#6200ee' : '#222'} />
        ),
        tabBarButton: (props) => (
          <CustomTabBarButton {...props} />
        ),
      }}
    />
    <Tab.Screen
      name="Shop"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Ionicons name="person" size={24} color={focused ? '#6200ee' : '#222'} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default function RootNavigation() {
  return (
    // <NavigationContainer>
      <MyTabs />
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    // backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 70,
    backgroundColor:"#dedede"
    // ...styles.shadow,
  },
  customButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0078ee',
    justifyContent: 'center',
    alignItems: 'center',
    // ...styles.shadow,
  },
  shadow: {
    shadowColor: '#7F5DF0',
    // shadowOffset: {
    //   width: 0,
    //   height: 10,
    // },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
