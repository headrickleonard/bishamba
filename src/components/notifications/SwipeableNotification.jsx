import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  GestureHandlerRootView,
  State,
} from "react-native-gesture-handler";
import NotificationCard from "./NotificationCard";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = -SCREEN_WIDTH * 0.3;

const SwipeableNotification = ({ message, onSwipe }) => {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleGesture = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      translateX.value = event.nativeEvent.translationX;
    } else if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX < SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH);
        runOnJS(onSwipe)();
      } else {
        translateX.value = withSpring(0);
      }
    }
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <Text style={styles.actionText}>Delete</Text>
          <Text style={styles.actionText}>Archive</Text>
        </View>
        <PanGestureHandler onGestureEvent={handleGesture}>
          <Animated.View style={[styles.animatedContainer, animatedStyle]}>
            <NotificationCard message={message} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    position: "relative",
  },
  animatedContainer: {
    width: "100%",
  },
  actionsContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffdddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SwipeableNotification;
