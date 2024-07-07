import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  measure,
  runOnUI,
  withTiming,
} from "react-native-reanimated";

const TabBarButton = ({ onPress, title, onLayout, isActive }) => {
  const animatedRef = useRef(null);

  // const handlePress = () => {
  //   runOnUI(() => {
  //     const measurement = measure(animatedRef.current);
  //     onPress(measurement);
  //   })();
  // };
  const handlePress = () => {
    runOnUI(() => {
      if (animatedRef.current) {
        const measurement = measure(animatedRef.current);
        console.log("Measurement:", measurement);
        onPress(measurement);
      } else {
        console.error("animatedRef.current is null");
      }
    })();
  };
  const handleLayout = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    const measurement = { x, y, width, height };
    onPress(measurement);
  };
  
  const textAStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(isActive ? "black" : "#6c7589", { duration: 350 }),
    };
  });

  return (
    <Pressable onLayout={onLayout} ref={animatedRef} onPress={handlePress}>
      <Animated.Text style={[styles.tabTitle, textAStyle]}>
        {title}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tabTitle: {
    fontWeight: "500",
    fontSize: 14,
  },
});

export default TabBarButton;
