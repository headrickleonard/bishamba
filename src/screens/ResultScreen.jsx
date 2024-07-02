import React,{useRef} from "react";
import { ScrollView, Animated } from "react-native";
import Header from "../components/result/Header";
import PlantDetails from "../components/result/PlantDetails";
import styles from "../styles/styles";
import WarningAlert from "../components/result/WarningAlert";
const ResultScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <Animated.ScrollView
      indicatorStyle="black"
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
      
    >
      <Header scrollY={scrollY} />
      {/* <WarningAlert/> */}
      <PlantDetails />
    </Animated.ScrollView>
  );
};

export default ResultScreen;
