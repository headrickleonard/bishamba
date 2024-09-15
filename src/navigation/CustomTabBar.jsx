import { BottomTabBar } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";

const CustomTabBar = (props) => {
  if (
    props.state.routes[props.state.index].name === "Scan" ||
    props.state.routes[props.state.index].name === "Details"
  ) {
    return null;
  }
  return (
    <View style={styles.container}>
      <BottomTabBar {...props} style={styles.tabBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 5,
    left: 20,
    right: 20,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tabBar: {
    // backgroundColor: "#ffffff",
    borderTopWidth: 0,
  },
});

export default CustomTabBar;
