import Animated, {
  withTiming,
  withRepeat,
  interpolate,
  useSharedValue,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import React, { useEffect } from "react";
import Feather from "react-native-vector-icons/Feather";
//   import StatusBarManager from '../components/StatusBarManager';
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const AnimLinear = Animated.createAnimatedComponent(LinearGradient);

const SLIDER_W = 268;
const SLIDER_FINAL_W = 76;
const SLIDER_H = 76;

const AnimatedText = ({
  index,
  char,
  coloring,
  silderWidth,
  totalCharsLength,
}) => {
  const textColor = useAnimatedStyle(() => {
    const interval = 1 / (totalCharsLength + 8);

    return {
      opacity: interpolate(silderWidth.value, [SLIDER_W, 260], [1, 0]),
      color: interpolateColor(
        coloring.value,
        [
          0.2 + (index - 3) * interval,
          0.2 + (index - 2) * interval,
          0.2 + (index - 1) * interval,
          0.2 + index * interval,
          0.2 + (index + 1) * interval,
          0.2 + (index + 2) * interval,
          0.2 + (index + 3) * interval,
        ],
        [
          "#a10000",
          "#ff6161",
          "#ffad9c",
          "#ffffff",
          "#ffad9c",
          "#ff6161",
          "#a10000",
        ]
      ),
    };
  });

  return (
    <Animated.Text key={`index-${index}`} style={[textColor, styles.text]}>
      {char}
    </Animated.Text>
  );
};

const ShutdownIOS = () => {
  const silderWidth = useSharedValue(SLIDER_W);
  const coloring = useSharedValue(0);
  const reachEnd = useSharedValue(false);
  const finishProgress = useSharedValue(0);

  const chars = "slide to power off".split("");
  const totalCharsLength = chars.length;

  const background = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        silderWidth.value,
        [SLIDER_W, SLIDER_FINAL_W],
        [0.75, 1]
      ),
    }),
    []
  );

  const innerBackground = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      silderWidth.value,
      [SLIDER_W, 75],
      ["rgba(0,0,0,0)", "rgba(0,0,0,1)"]
    ),
    width: silderWidth.value,
  }));

  const slider = useAnimatedStyle(
    () => ({
      width: silderWidth.value,
      transform: [{ translateX: 268 - silderWidth.value }],
    }),
    []
  );

  const powerBtn = useAnimatedStyle(() => ({
    opacity: interpolate(finishProgress.value, [0, 1], [1, 0]),
    transform: [
      { scale: interpolate(finishProgress.value, [0, 0.2, 1], [1, 1.2, 0]) },
    ],
  }));

  const gesture = Gesture.Pan()
    .onChange((e) => {
      if (e.translationX < 0) {
        silderWidth.value = SLIDER_W;
      } else if (SLIDER_W - e.translationX > SLIDER_FINAL_W) {
        silderWidth.value = SLIDER_W - e.translationX;
      } else if (silderWidth.value < 90) {
        reachEnd.value = true;
      }
    })
    .onFinalize(() => {
      if (reachEnd.value) {
        finishProgress.value = withTiming(1, { duration: 500 }, (finished) => {
          if (finished) {
            silderWidth.value = withTiming(SLIDER_W);
            reachEnd.value = false;
            finishProgress.value = withTiming(0);
          }
        });
      } else {
        silderWidth.value = withTiming(SLIDER_W);
      }
    });

  useEffect(() => {
    coloring.value = withRepeat(withTiming(1, { duration: 2250 }), 0);
  }, [coloring]);

  return (
    <>
      {/* <StatusBarManager barStyle="light" /> */}
      <ImageBackground
        source={require("../assets/images/ios_wallpaper.png")}
        style={{ width, height }}
      >
        <Animated.View style={[styles.filterBackground, background]} />

        <Animated.View style={styles.sliderContainer}>
          <AnimLinear
            start={{ x: 0.35, y: 0 }}
            colors={["#bf3354", "#f43f46", "#fe5334"]}
            style={[styles.radius200, slider]}
          >
            <Animated.View style={[innerBackground, styles.sliderFilter]} />
            <GestureDetector gesture={gesture}>
              <Animated.View style={[powerBtn, styles.powerBtn]}>
                <Feather name="power" size={36} color={"#da0b13"} />
              </Animated.View>
            </GestureDetector>

            <View style={styles.textContainer}>
              {chars.map((char, index) => (
                <AnimatedText
                  key={`index-${index}`}
                  char={char}
                  index={index}
                  coloring={coloring}
                  silderWidth={silderWidth}
                  totalCharsLength={totalCharsLength}
                />
              ))}
            </View>
          </AnimLinear>
        </Animated.View>
      </ImageBackground>
    </>
  );
};

export default ShutdownIOS;

const styles = StyleSheet.create({
  filterBackground: {
    width,
    height,
    backgroundColor: "black",
  },
  sliderContainer: {
    position: "absolute",
    flexDirection: "row",
    left: (width - SLIDER_W) / 2,
    marginTop: 150,
    height: SLIDER_H,
  },
  sliderFilter: {
    position: "absolute",
    borderRadius: 200,
    height: SLIDER_H,
    width: SLIDER_W,
  },
  powerBtn: {
    position: "absolute",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 100,
    top: 4,
    left: 3,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    top: 28,
    left: 68,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
  radius200: {
    borderRadius: 200,
  },
});
