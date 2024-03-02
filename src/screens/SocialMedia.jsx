import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  useWindowDimensions
} from "react-native";
import React, { useCallback, useRef } from "react";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { TapGestureHandler } from "react-native-gesture-handler";

const AppBar = () => {
  return (
    <View className="h-24 w-full bg-green-500 flex flex-row items-end justify-end ">
      <View className="flex flex-row items-end justify-end p-2">
        <TouchableOpacity>
          <Image
            source={require("../assets/icons/search.png")}
            className="h-8 w-8 mx-2"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../assets/icons/add.png")}
            className="h-8 w-8 mx-2"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const SearchBar = () => {
  return (
    <View className="flex flex-row items-center justify-between p-2 h-20 w-full">
      <Image
        source={require("../assets/images/farm.jpeg")}
        className="h-12 w-12 rounded-full"
      />
      <TextInput
        className="h-10 w-[80%] border border-slate-400 rounded-full p-2"
        placeholder="search anything..."
        cursorColor={"gray"}
        selectionColor={"gray"}
        inputMode="search"
      />
    </View>
  );
};
const Options = () => {
  return (
    <View className="flex flex-row items-center justify-center gap-2 w-full">
      <TouchableOpacity className="w-1/3 border-r-4 border-slate-500 flex flex-row items-center justify-center">
        <Image
          source={require("../assets/icons/ask.gif")}
          className="h-8 w-8"
        />
        <Text>uliza</Text>
      </TouchableOpacity>
      <TouchableOpacity className="w-1/3 border-r-4 border-slate-500 flex flex-row items-center justify-center">
        <Image
          source={require("../assets/icons/like.png")}
          className="h-8 w-8"
        />
        <Text>uliza</Text>
      </TouchableOpacity>
      <TouchableOpacity className="w-1/3 flex flex-row items-center justify-center">
        <Text className="text-lg font-bold text-slate-600">Post</Text>
      </TouchableOpacity>
    </View>
  );
};
const Banner = () => {
  return (
    <View className="flex flex-row items-center justify-between bg-white my-4 p-2">
      <Image
        source={require("../assets/icons/thumbnail.png")}
        className="h-12 w-12"
      />
      <View className="flex flex-col items-start justify-center w-3/4">
        <Text className="font-bold text-lg">Masoko mapya ya korosho</Text>
        <Text className="text-sm font-light text-slate-500">
          Masoko mapya ya korosho nje...
        </Text>
      </View>
    </View>
  );
};
const Profile = () => {
  return (
    <View className="flex flex-col items-center justify-around h-fit w-fit p-1">
      <Image
        source={require("../assets/images/terraces.jpeg")}
        className="h-12 w-12 rounded-full"
      />
      <Text className="text-slate-500 font-normal">1 hour</Text>
    </View>
  );
};
const Chat = () => {
  const doubleTapRef = useRef();
  const AnimatedImage = Animated.createAnimatedComponent(Image);
  const scale = useSharedValue(0);
  const rstyles = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(scale.value, 0) }],
  }));
  const onDoubleTap = useCallback(() => {
    scale.value = withSpring(1, undefined, (isFinished) => {
      if (isFinished) {
        scale.value = withSpring(0);
      }
    });
  }, []);

  return (
    <View className="flex flex-col items-center justify-evenly h-96 w-[80%] bg-slate-50 rounded-xl p-2">
      <View className="w-full flex flex-row items-center justify-between">
        <View>
          <Text className="font-bold text-slate-800">Joshua simon</Text>
          <Text className="font-semibold text-slate-600">Mbeya Tanzania</Text>
        </View>
        <Image
          source={require("../assets/icons/more.png")}
          className="h-4 w-8"
        />
      </View>
      <View className="h-60 w-full flex flex-col items-center justify-evenly">
        <Text>some really long description here for the image..</Text>
        <Image source={require("../assets/images/terraces.jpeg")} />

        {/* <TapGestureHandler
          waitFor={doubleTapRef}
          onActivated={() => {
            console.log("single tap");
          }}
        >
          <TapGestureHandler
            maxDelayMs={250}
            ref={doubleTapRef}
            numberOfTaps={2}
            onActivated={onDoubleTap}
          >
            <Animated.View className="">
              <ImageBackground
                source={require("../assets/images/terraces.jpeg")}
              >
                <AnimatedImage
                  source={require("../assets/icons/heart.png")}
                  resizeMode="center"
                  className="h-24 w-24"
                  style={rstyles}
                />
              </ImageBackground>
            </Animated.View>
          </TapGestureHandler>
        </TapGestureHandler> */}
      </View>
      <View className="h-fit -mt-4 w-full flex items-end justify-center">
        <Text className="font-light text-slate-500">12 replies</Text>
      </View>
      <View className="w-full flex flex-row items-center justify-evenly">
        <Image
          source={require("../assets/icons/like.png")}
          className="h-8 w-8 mr-3"
        />
        <Image
          source={require("../assets/icons/dislike.png")}
          className="h-8 w-8"
        />
        <Image
          source={require("../assets/icons/share.png")}
          className="h-8 w-8"
        />
      </View>
    </View>
  );
};
const Post = () => {
  return (
    <Animated.View
      className="flex flex-row items-start justify-between px-2 my-4"
      style={{
        elevation: 10,
      }}
      entering={FadeInDown.delay(100).duration(600).springify().damping(12)}
    >
      <Profile />
      <Chat />
    </Animated.View>
  );
};

const SocialMedia = () => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  return (
    <ScrollView
      className="bg-slate-200"
      contentContainerStyle={{
        display: "flex",
        paddingTop:windowHeight*0.05
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* <AppBar /> */}
      <View
        className="bg-white p-2"
        style={{
          elevation: 10,
        }}
      >
        <SearchBar />
        <Options />
      </View>
      <Banner />
      <Post />
      <Post />
    </ScrollView>
  );
};

export default SocialMedia;
