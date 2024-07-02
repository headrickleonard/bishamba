import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Divider } from "react-native-paper";
import OverviewItem from "./OverviewItem";
import styles from "../../styles/styles";
import { ScanSearch } from "lucide-react-native";

const PlantDetails = () => {
  const overviewItems = [
    {
      iconName: "sun",
      iconColor: "orange",
      title: "Light:",
      description:
        "Peace Lilies thrive in medium to low light conditions. They do well in bright, indirect light but can also tolerate lower light levels, making them perfect for offices and rooms with less natural light.",
    },
    {
      iconName: "droplet",
      iconColor: "cyan",
      title: "Water:",
      description:
        "These plants prefer consistently moist soil. Water the Peace Lily when the top inch of soil feels dry. Be careful not to overwater, as Peace Lilies are susceptible to root rot.",
    },
    {
      iconName: "sun",
      iconColor: "orange",
      title: "Sunlight:",
      description:
        "Direct sunlight can scorch the leaves of a Peace Lily. Place your plant in a location with indirect sunlight or filtered light for optimal growth.",
    },
  ];
  return (
    <View>
      <View className="my-4 flex flex-col px-4">
        <Text className="font-extrabold text-2xl mt-4 text-start">
          Peace Lily plant
        </Text>
        <Text className="text-lg mb-4 mt-2">Spathiphyllum</Text>
        <TouchableOpacity className="h-12 w-full rounded-xl flex flex-row items-center justify-center bg-green-500" activeOpacity={0.9} >
          <Text className="text-lg font-bold text-white">Get Care Plan</Text>
        </TouchableOpacity>
      </View>
      <Divider />
      <View className="flex flex-row items-center justify-start px-4">
        <Pressable className="pt-4 mx-2">
          <ScanSearch color="black" size={24} />
        </Pressable>
        <Text className="font-bold text-xl mt-4">Plant overview</Text>
      </View>
      <View style={styles.overviewContainer}>
        {overviewItems.map((item, index) => (
          <OverviewItem
            key={index}
            iconName={item.iconName}
            iconColor={item.iconColor}
            title={item.title}
            description={item.description}
          />
        ))}
      </View>
    </View>
  );
};

export default PlantDetails;
