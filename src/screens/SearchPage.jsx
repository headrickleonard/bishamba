import React, { useState } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import { Searchbar } from "react-native-paper";
import Animated, {
  FadeInDown,
  FadeOutDown
} from "react-native-reanimated";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  const onSubmitSearch = () => {
    // Perform search action with the query
    console.log("Search query:", searchQuery);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-slate-300"
      style={{ paddingVertical: hp(6), paddingHorizontal: wp(4) }}
    >
      <View>
        <Searchbar
          placeholder="dawa ya..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          onSubmitEditing={onSubmitSearch}
          style={{ height: hp(6), width: wp(92), marginBottom: hp(2) }}
          className="placeholder:text-slate-500 bg-slate-200"
        />
        {/* <View
          className="flex w-full h-72 bg-slate-100 rounded-xl"
          style={{ width: wp(92) }}
        >
          <View className="w-full h-12 border-b-[1px] border-neutral-200 flex flex-row items-center justify-between">
            <Text className="text-black font-semibold text-lg mx-2">
              dawa ya<Text className="text-slate-500 font-light"> mende</Text>
            </Text>
            <Button
              icon="magnify"
              mode="text"
              className="text-black"
              style={{ color: "black" }}
            />
          </View>
          <View className="w-full h-12 border-b-[1px] border-neutral-200 flex flex-row items-center justify-between">
            <Text className="text-black font-semibold text-lg mx-2">
              dawa ya<Text className="text-slate-500 font-light"> mahindi</Text>
            </Text>
            <Button
              icon="magnify"
              mode="text"
              className="text-black"
              style={{ color: "black" }}
            />
          </View>
          <View className="w-full h-12 border-b-[1px] border-neutral-200 flex flex-row items-center justify-between">
            <Text className="text-black font-semibold text-lg mx-2">
              dawa ya<Text className="text-slate-500 font-light"> magugu</Text>
            </Text>
            <Button
              icon="magnify"
              mode="text"
              className="text-black"
              style={{ color: "black" }}
            />
          </View>
        </View> */}
        <View
          className="flex flex-row flex-wrap"
          style={{ width: wp(90), height: hp(50) }}
        >
          <Animated.View
            className="flex flex-row items-center justify-evenly bg-white rounded-lg m-2"
            style={{ height: hp(10), width: wp(40) }}
            entering={FadeInDown.delay(100).springify()}
            exiting={FadeOutDown}
          >
            <Image
              source={require("../assets/images/gallon.png")}
              className="h-12 w-12"
            />
            <Text className="text-lg font-semibold">insectcide</Text>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchPage;
