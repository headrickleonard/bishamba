// Onboarding.js
import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import CircularButton from "../components/onboard/CircularButton";
import OnboardingItem from "../components/onboard/OnboardingItem";
import { screens } from "../utils/screen";
import { SCREEN_WIDTH } from "../utils/screen";
import Paginator from "../components/onboard/Paginator";
import ScreenWrapper from "../components/shared/ScreenWrapper";

const MAX_LENGTH = screens.length;

const OnboardingScreen = ({navigation}) => {
  const aref = useAnimatedRef();
  const [index, setIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
    runOnJS(setIndex)(Math.round(event.contentOffset.x / SCREEN_WIDTH));
  });
  const onPressButton = () => {
    if (index !== MAX_LENGTH - 1) {
      aref.current?.scrollTo({
        x: index > 0 ? SCREEN_WIDTH * (index + 1) : SCREEN_WIDTH,
        y: 0,
        animated: true,
      });
      setIndex(index + 1);
    }else {
      navigation.replace('MainApp'); // Navigate to the main tabs
    }
  };
  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.safeAreaView}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          ref={aref}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          pagingEnabled
        >
          {screens.map((screen, index) => (
            <OnboardingItem screen={screen} key={index.toString()} />
          ))}
        </Animated.ScrollView>
        <View>
          <Paginator itemsLength={screens.length} scrollX={scrollX} />
          <CircularButton
            screensLenght={screens.length}
            onPress={onPressButton}
            index={index}
          />
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});

export default OnboardingScreen;
