import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Scanned = () => {
  return (
    <View className="flex flex-col items-center justify-between p-2 my-2 w-full h-fit bg-green-200 rounded-xl">
      <View className="flex flex-row items-center justify-between w-full my-1 ">
        <Text className="font-semibold text-lg">scanned</Text>
        <TouchableOpacity>
          <Text className="font-light text-lg underline">All</Text>
        </TouchableOpacity>
      </View>
      <View className="w-full h-fit mt-1">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="h-fit w-full"
        >
          <Image
            source={require("../assets/images/farm.jpeg")}
            className="h-16 w-24 rounded-xl mx-2"
          />
          <Image
            source={require("../assets/images/terraces.jpeg")}
            className="h-16 w-24 rounded-xl mx-2"
          />
          <Image
            source={require("../assets/images/farm.jpeg")}
            className="h-16 w-24 rounded-xl mx-2"
          />
          <Image
            source={require("../assets/images/terraces.jpeg")}
            className="h-16 w-24 rounded-xl mx-2"
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Scanned;
