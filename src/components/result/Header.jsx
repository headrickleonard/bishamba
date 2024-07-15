import React, { useEffect, useRef, useState } from "react";
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
import RBSheet from "react-native-raw-bottom-sheet";
import Feedback from "./../form/Feedback";
const { height } = Dimensions.get("window");
const HEIGHT_FACTOR = 50;

const Header = ({ scrollY, photoUri }) => {
  const refRBSheet = useRef();

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
        // source={require("../../assets/images/plant4.png")}
        source={{ uri: photoUri }}
        style={styles.image}
      />
      {/* <TouchableOpacity style={styles.closeIcon} className="bg-black/10">
        <XIcon color="white" size={24} />
      </TouchableOpacity> */}
      <View style={styles.reactionIcons}>
        <TouchableOpacity
          style={styles.iconButton}
          className="bg-black/10 p-2 my-1 rounded-full"
          activeOpacity={0.9}
          onPress={() => {
            refRBSheet.current.open();
          }}
        >
          <ThumbsUp color="white" size={24} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.iconButton}
          className="bg-black/10 p-2 my-1 rounded-full"
          activeOpacity={0.9}
        >
          <ThumbsDownIcon color="white" size={24} />
        </TouchableOpacity> */}
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
      <RBSheet
        ref={refRBSheet}
        height={350}
        openDuration={250}
        dragFromTopOnly={true}
        closeOnDragDown
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            elevation: 20,
          },
          draggableIcon: {
            backgroundColor: "#dedede",
          },
        }}
      >
        <Feedback />
      </RBSheet>
    </Animated.View>
  );
};

export default Header;
