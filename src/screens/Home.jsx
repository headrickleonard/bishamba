import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import LoopText from "react-native-loop-text";
import Shazam from "../components/Shazam";
import WeatherCard from "../components/WeatherCard";
import NextScreen from "../components/NextScreen";
import Index from "../components/Carousel";
import Scanned from "../components/Scanned";
import NearYou from "../components/NearYou";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const navigation = useNavigation();

  const move = () => {
    // navigation.navigate("Media");
    navigation.navigate("Camera");
  };

  return (
    <View className="h-full w-full bg-green-600 pt-10">
      <View className="h-1/2 w-full flex flex-col items-center justify-evenly">
        <LoopText
          textArray={["scan your plant..", "scan mmea wako.."]}
          className="text-white text-center font-bold text-xl"
        />
        <Shazam />
        <TouchableOpacity
          className="bg-green-800 h-24 w-24 bg-opacity-80 rounded-full flex items-center justify-center absolute mt-[116px]"
          onPress={move}
        >
          <Text className="text-green-200 font-bold text-xl opacity-100">
            SCAN
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: "white", padding: 8 }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "column",
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <WeatherCard />
        <Scanned />
        <View className="w-full h-fit my-1">
          <Text className="text-xl font-semibold">Near you</Text>
        </View>
        <NearYou />
      </ScrollView>
    </View>
  );
};

export default Home;
