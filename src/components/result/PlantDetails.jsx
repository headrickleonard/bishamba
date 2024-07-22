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
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
const PlantDetails = ({ plantDetails }) => {
  // Destructure the plant details object to get the data
  const {
    commonName,
    scientificName,
    images,
    symptoms,
    management,
    recommendedTreatment,
    cause,
  } = plantDetails;

  const overviewItems = [
    {
      iconName: "alert-circle",
      iconColor: "red",
      title: "Symptoms:",
      description: symptoms,
    },
    {
      iconName: "alert-triangle",
      iconColor: "yellow",
      title: "Effects:",
      description: cause, // or another appropriate field from plantDetails
    },
    {
      iconName: "shield",
      iconColor: "green",
      title: "Prevention/Treatment:",
      description: management,
    },
  ];
  const handleImagePress = (image, index) => {
    navigation.navigate("ImageViewer", { image, images });
  };
  const relatedImages = images;
  const navigation = useNavigation();
  const recommendedItems = recommendedTreatment.map((item) => ({
    name: item.name,
    description: item.description,
    imageUri: item.imageUri,
  }));

  return (
    <View>
      <View className="my-4 flex flex-col px-4">
        <Text className="font-extrabold text-2xl mt-4 text-start">
          {commonName}
        </Text>
        <Text className="text-lg mb-4 mt-2">{scientificName}</Text>
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
          {images.map((image, index) => (
            <Pressable
              key={index}
              onPress={() => handleImagePress(image, index)}
            >
              <Image
                source={{ uri: image }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 12,
                  marginHorizontal: 10,
                }}
              />
            </Pressable>
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
