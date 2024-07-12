import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Animated, {
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);
const SensorAnimation = () => {
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 50,
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const { pitch, roll, yaw } = animatedSensor.sensor.value;
    return {
      transform: [
        {
          translateX: withSpring(-roll * 60),
        },
        {
          translateY: withSpring(-pitch * 60),
        },
      ],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const { pitch, roll, yaw } = animatedSensor.sensor.value;
    return {
      transform: [
        {
          translateX: withSpring(roll * 50),
        },
        {
          translateY: withSpring(pitch * 50),
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AnimatedImageBackground
        style={[styles.backImage, backAnimatedStyle]}
        source={{
          uri: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
        }}
      >
        <Animated.Image
          style={[styles.frontImage, frontAnimatedStyle]}
          source={{uri:"https://plus.unsplash.com/premium_photo-1664551735221-7f7ab58991d3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNvcm58ZW58MHx8MHx8fDA%3D"}}
        />
      </AnimatedImageBackground>
    </View>
  );
};

export default SensorAnimation;

const styles = StyleSheet.create({
  backImage: {
    flex: 1,
    width: "130%",
    height: "120%",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  frontImage: {
    position: "absolute",
    bottom: -50,
    width: "80%",
    height: "50%",
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
});
