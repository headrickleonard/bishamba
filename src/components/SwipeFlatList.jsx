import React, { useRef } from "react";
import { View, FlatList, PanResponder, Animated } from "react-native";

export default SwipeableFlatList = ({
  data,
  renderItem,
  keyExtractor,
  contentContainerStyle,
}) => {
  const swipeX = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Check if swipe is from left to right and there's no active swipe
        return (
          gestureState.dx > 10 &&
          gestureState.dy < 10 &&
          gestureState.dx > gestureState.dy &&
          activeIndex === null
        );
      },
      onPanResponderGrant: (evt, gestureState) => {
        // Set active index when swipe starts
        setActiveIndex(gestureState.y0);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (activeIndex !== gestureState.y0) return;
        swipeX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (activeIndex !== gestureState.y0) return;
        // Check if swipe is completed to the left
        if (gestureState.dx < -100) {
          // Implement your action here for left swipe
          console.log("Swiped left!");
          // You can also trigger an animation for the swipe action
        }
        // Reset swipe
        Animated.spring(swipeX, {
          toValue: 0,
          useNativeDriver: false,
        }).start(() => setActiveIndex(null));
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Reset swipe
        Animated.spring(swipeX, {
          toValue: 0,
          useNativeDriver: false,
        }).start(() => setActiveIndex(null));
      },
    })
  ).current;

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => (
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            transform: [{ translateX: activeIndex === index ? swipeX : 0 }],
          }}
        >
          {renderItem({ item, index })}
        </Animated.View>
      )}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
    />
  );
};

// Usage:
