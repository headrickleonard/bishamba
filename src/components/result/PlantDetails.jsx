import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { Divider } from "react-native-paper";
import OverviewItem from "./OverviewItem";
import styles from "../../styles/styles";
import { ScanSearch } from "lucide-react-native";

const PlantDetails = () => {
  const overviewItems = [
    {
      iconName: "alert-circle",
      iconColor: "red",
      title: "Symptoms:",
      description:
        "Yellowing leaves, brown spots, wilting, stunted growth, and leaf drop are common symptoms of the detected plant disease.",
    },
    {
      iconName: "alert-triangle",
      iconColor: "yellow",
      title: "Effects:",
      description:
        "If left untreated, the disease can cause severe damage to the plant, including reduced vigor, poor flowering, and eventual death.",
    },
    {
      iconName: "shield",
      iconColor: "green",
      title: "Prevention/Treatment:",
      description:
        "To prevent and treat the disease, ensure proper watering, improve air circulation, and apply appropriate fungicides or insecticides as recommended.",
    },
  ];
  const relatedImages = [
    "https://images.unsplash.com/photo-1554402100-8d1d9f3dff80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29ybnxlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1664551735221-7f7ab58991d3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNvcm58ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1629828874546-8d46cf1d49d9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNvcm58ZW58MHx8MHx8fDA%3D",
  ];
  const recommendedItems = [
    {
      name: "Neem Oil",
      description:
        "A natural pesticide and fungicide that helps protect plants from a variety of pests and diseases.",
      imageUri:
        "https://plus.unsplash.com/premium_photo-1690116977873-db6296c22d33?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fG5lZW0lMjBvaWx8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Copper Fungicide",
      description:
        "An effective treatment for fungal infections such as blight and powdery mildew.",
      imageUri:
        "https://cdn.commercev3.net/www.spray-n-growgardening.com/images/popup/copperconha21.jpg",
    },
    {
      name: "Insecticidal Soap",
      description:
        "A safe and effective solution for controlling aphids, spider mites, and other common pests.",
      imageUri:
        "https://mobileimages.lowes.com/productimages/8c88e20f-9ef6-458d-8938-4b55c60bc3ee/00511604.jpg?size=pdhism",
    },
  ];
  return (
    <View>
      <View className="my-4 flex flex-col px-4">
        <Text className="font-extrabold text-2xl mt-4 text-start">
          Peace Lily plant
        </Text>
        <Text className="text-lg mb-4 mt-2">Spathiphyllum</Text>
        <TouchableOpacity
          className="h-12 w-full rounded-xl flex flex-row items-center justify-center bg-green-500"
          activeOpacity={0.9}
        >
          <Text className="text-lg font-bold text-white">Get Care Plan</Text>
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 20 }}>
          Related Images
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {relatedImages.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 12,
                marginHorizontal: 10,
              }}
            />
          ))}
        </ScrollView>
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
      
      <View className="flex flex-row items-center justify-start px-4">
        <Text className="font-bold text-xl mt-4">Recommended Treatments</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.recommendedContainer}
      >
        {recommendedItems.map((item, index) => (
          <View key={index} style={styles.recommendedItem}>
            <Image
              source={{ uri: item.imageUri }}
              style={styles.recommendedImage}
            />
            <Text style={styles.recommendedName}>{item.name}</Text>
            <Text style={styles.recommendedDescription}>
              {item.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PlantDetails;
