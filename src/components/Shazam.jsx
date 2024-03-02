import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

const Shazam = () => {
  const circleScale1 = useSharedValue(0);
  const circleScale2 = useSharedValue(0);
  const circleScale3 = useSharedValue(0);
  // opacity
  const circleOpacity1 = useSharedValue(1);
  const circleOpacity2 = useSharedValue(1);
  const circleOpacity3 = useSharedValue(1);

  useEffect(() => {
    const scaleAnimation1 = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1000, easing: Easing.sin }),
        withTiming(1, { duration: 1500, easing: Easing.bounce }),
        withTiming(1.5, { duration: 2000, easing: Easing.sin })
      ),
      -1,
      true
    );
    // const scaleAnimation1 = withRepeat(
    //   withSequence(
    //     withTiming(1, { duration: 1000, easing: Easing.sin }),
    //     withTiming(1, { duration: 1000 }), // Start opacity animation
    //     withTiming(2, { duration: 1500, easing: Easing.bounce }),
    //     withTiming(0, { duration: 1000 }), // End opacity animation
    //     withTiming(3, { duration: 2000, easing: Easing.sin })
    //   ),
    //   -1,
    //   true
    // );

    const scaleAnimation2 = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.sin }),
        withTiming(1.2, { duration: 2000, easing: Easing.sin }),
        withTiming(2, { duration: 2000, easing: Easing.ease })
      ),
      -1,
      true
    );
    const scaleAnimation3 = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.sin }),
        withTiming(1.5, { duration: 1500, easing: Easing.sin }),
        withTiming(2, { duration: 2000, easing: Easing.sin })
      ),
      -1,
      true
    );

    circleScale1.value = scaleAnimation1;
    circleScale2.value = scaleAnimation2;
    circleScale3.value = scaleAnimation3;
    // circleOpacity1.value = circleOpacity1;
    // circleOpacity2.value = circleOpacity2;
    // circleOpacity3.value = circleOpacity3;
  }, []);

  return (
    <View
      className="rounded-full items-center justify-center bg-green-500"
      //   style={{ height: "100%", width: "100%" }}
    >
      <Animated.View
        className="h-16 w-16 border-8 border-green-300 rounded-full absolute z-20 flex flex-col items-center justify-center"
        style={{ transform: [{ scale: circleScale1 }] }}
      ></Animated.View>
      <Animated.View
        className="h-24 w-24 bg-green-400 border-4 border-opacity-50 border-green-200 rounded-full absolute z-10"
        style={{ transform: [{ scale: circleScale2 }] }}
      ></Animated.View>
      <Animated.View
        className="h-32 w-32 bg-green-400 border-4 border-opacity-50 border-green-300 rounded-full"
        style={{ transform: [{ scale: circleScale3 }] }}
      ></Animated.View>
    </View>
  );
};

export default Shazam;
