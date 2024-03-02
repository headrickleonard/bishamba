import { View, Text, Dimensions, Image, ScrollView } from "react-native";
import React from "react";

const NearCard = () => {
  const width = Dimensions.get("window").width / 3;

  return (
    <View
      className="flex flex-col items-center justify-between h-fit rounded-lg m-2 border-2 border-green-100"
      style={{ width: width }}
    >
      <Image
        source={require("../assets/images/farm.jpeg")}
        className="h-1/2 w-full rounded-t-md"
      />
      <View className="flex flex-col w-full h-1/2 p-1">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-lg font-bold">maize sumt</Text>
          <Text className="text-xl">⚱</Text>
        </View>
        <Text className="text-xl font-light text-slate-600">30 detections</Text>
      </View>
    </View>
  );
};

const NearYou = () => {
  const nearCards = Array.from({ length: 6 }, (_, index) => index + 1);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="h-36 w-full rounded-xl"
    >
      {nearCards.map((cardIndex) => (
        <NearCard key={cardIndex} />
      ))}
    </ScrollView>
  );
};

export default NearYou;
