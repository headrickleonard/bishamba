// CircularButton.js
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import IconButton from "./IconButton";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const radius = 50;
const circumference = radius * Math.PI * 2;
const centerX = 70;
const centerY = 70;

const CircularButton = ({ screensLenght, onPress, index }) => {
  const strokeOffset = useSharedValue(circumference);
  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(strokeOffset.value, { duration: 500 }),
    };
  });

  useEffect(() => {
    let percentage = circumference / screensLenght;
    strokeOffset.value = circumference - percentage * (index + 1);
  }, [index]);

  return (
    <View style={styles.circularButtonContainer}>
      <IconButton
        icon="arrow-right"
        onPress={onPress}
        roundness="full"
        size="big"
        style={styles.iconButtonStyle}
      />
      <Svg height={centerY * 2} width={centerX * 2}>
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="#32c759"
          strokeWidth="2"
        />
        <AnimatedCircle
          animatedProps={animatedCircleProps}
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="#32c759"
          strokeWidth="4"
          strokeLinecap={"round"}
          strokeDasharray={`${radius * Math.PI * 2}`}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  circularButtonContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor:"transparent"
  },
  iconButtonStyle: {
    position: "absolute",
    zIndex: 2,
  },
});

export default CircularButton;
