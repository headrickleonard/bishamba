import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const WeatherCard = () => {
  return (
    <View className="flex flex-row items-center justify-evenly h-fit p-2 my-2 w-full bg-green-200 rounded-xl">
      <View>
        <LottieView
          source={require("../assets/anime/weather.json")}
          autoPlay
          loop
          style={{width:30,height:30,backgroundColor:"transparent"}}
        />
      </View>
      <View className="flex flex-col items-start justify-evenly">
        <Text className="font-normal text-lg">
          <Text className="font-bold text-lg">30ºC </Text>
          in mbeya
        </Text>
        <Text className="text-lg">Jua kali</Text>
      </View>
      <View className="flex flex-col items-start justify-evenly">
        <Text className="text-lg">
          soil temp:<Text className="font-bold text-lg"> 30ºC </Text>
        </Text>
        <Text className="text-lg">
          soil temp:<Text className="font-bold text-lg"> 30ºC </Text>
        </Text>
      </View>
    </View>
  );
};

export default WeatherCard;
