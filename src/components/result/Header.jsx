import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import { XIcon, ThumbsUp, ThumbsDownIcon, InfoIcon } from "lucide-react-native";
import styles from "../../styles/styles";

const { height } = Dimensions.get("window");
const HEIGHT_FACTOR = 50;

const Header = ({ scrollY }) => {
  const headerHeight = scrollY.interpolate({
    inputRange: [0, height / 2 + HEIGHT_FACTOR],
    outputRange: [height / 2 + HEIGHT_FACTOR, HEIGHT_FACTOR],
    extrapolate: "clamp",
  });
  //   const scale = scrollY.interpolate({
  //     inputRange: [0, height / 2 + HEIGHT_FACTOR],
  //     outputRange: [1, HEIGHT_FACTOR / (height / 2 + HEIGHT_FACTOR)],
  //     extrapolate: "clamp",
  //   });
  return (
    <Animated.View
      style={[styles.header, { height: headerHeight }]}
      //   style={[styles.header, { transform: [{ scaleY: scale }] }]}
      className="bg-neutral-300/50"
    >
      <Image
        source={require("../../assets/images/plant4.png")}
        style={styles.image}
      />
      <TouchableOpacity style={styles.closeIcon} className="bg-black/10">
        <XIcon color="white" size={24} />
      </TouchableOpacity>
      <View style={styles.reactionIcons}>
        <TouchableOpacity
          style={styles.iconButton}
          className="bg-black/10 p-2 my-1 rounded-full"
          activeOpacity={0.9}
        >
          <ThumbsUp color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          className="bg-black/10 p-2 my-1 rounded-full"
          activeOpacity={0.9}
        >
          <ThumbsDownIcon color="white" size={24} />
        </TouchableOpacity>
      </View>
      {/* <View className="w-32 bg-neutral-500/80 rounded-full h-12 absolute -bottom-4 flex flex-row items-center justify-center">
        <TouchableOpacity
          style={styles.iconButton}
          className="p-2 my-1 rounded-full"
        >
          <InfoIcon color="white" size={24} />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-white">98%</Text>
      </View> */}
    </Animated.View>
  );
};

export default Header;
