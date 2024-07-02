import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import  TabBarButton  from "./TabBarButton";
import { SCREEN_WIDTH } from "../../const/window";

const INDICATOR_PADDING = 16;
const TAB_BAR_WIDTH = SCREEN_WIDTH * 0.95;
const SIDE_PADDING = (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2;
const Tabs = ["Messages", "Groups", "Invites", "Notifications"];

const TabBar = ({ onPress, activeIndex }) => {
  const [indicatorWidth] = useState(new Animated.Value(0));
  const [indicatorXPosition] = useState(new Animated.Value(0));

  const handlePress = (measurement, index) => {
    onPress(index);
    if (measurement) {
      const adjustedXPosition =
        measurement.pageX - INDICATOR_PADDING / 2 - SIDE_PADDING;
      Animated.timing(indicatorXPosition, {
        toValue: adjustedXPosition,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(indicatorWidth, {
        toValue: measurement.width + INDICATOR_PADDING,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLayout = (event, index) => {
    if (index === 0) {
      const { x, width } = event.nativeEvent.layout;
      const adjustedXPosition = x - INDICATOR_PADDING / 2;
      indicatorXPosition.setValue(adjustedXPosition);
      indicatorWidth.setValue(width + INDICATOR_PADDING);
    }
  };

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        {Tabs.map((tab, index) => (
          <TabBarButton
            key={index}
            title={tab}
            isActive={activeIndex === index}
            onPress={(measurement) => handlePress(measurement, index)}
            onLayout={(event) => handleLayout(event, index)}
          />
        ))}
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              transform: [{ translateX: indicatorXPosition }],
              width: indicatorWidth,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    width: "100%",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    width: TAB_BAR_WIDTH,
    backgroundColor: "#e6e8eb",
  },
  tabIndicator: {
    position: "absolute",
    backgroundColor: "white",
    height: 30,
    borderRadius: 20,
    zIndex: -1,
  },
});

export default TabBar;
