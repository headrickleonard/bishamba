import React, { useRef, useEffect } from "react";
import { ScrollView, Animated } from "react-native";
import Header from "../components/result/Header";
import PlantDetails from "../components/result/PlantDetails";
import styles from "../styles/styles";
import WarningAlert from "../components/result/WarningAlert";
import ScreenWrapper from "../components/shared/ScreenWrapper";

const ResultScreen = ({ route }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { imageUrl, data } = route.params.details;
  useEffect(() => {
    // console.log("the route params are:" + JSON.stringify(route.params));
  }, []);

  return (
    <Animated.ScrollView
      indicatorStyle="black"
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      <ScreenWrapper>
        <Header scrollY={scrollY} photoUri={imageUrl} />
        {/* <WarningAlert/> */}
        <PlantDetails plantDetails={data} />
      </ScreenWrapper>
    </Animated.ScrollView>
  );
};

export default ResultScreen;
