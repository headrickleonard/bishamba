import { useNavigation } from "@react-navigation/native";
import { ScanSearch } from "lucide-react-native";
import React, { useState ,useEffect} from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import styles from "../../styles/styles";
import OverviewItem from "./OverviewItem";
import { Card, IconButton } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const PlantDetails = ({ plantDetails }) => {
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
      description: cause,
    },
    {
      iconName: "shield",
      iconColor: "green",
      title: "Prevention/Treatment:",
      description: management,
    },
  ];

  const navigation = useNavigation();

  const handleImagePress = (image, index) => {
    navigation.navigate("ImageViewer", { image, images });
  };

  const trimDescription = (description) => {
    const firstPeriodIndex = description.indexOf(".");
    if (firstPeriodIndex === -1) return description;
    return description.substring(0, firstPeriodIndex + 1);
  };

  const recommendedItems = recommendedTreatment.map((item) => ({
    name: item.productName,
    fullDescription: item.description,
    shortDescription: trimDescription(item.description),
    imageUri: item.images[0],

  }));


  const toggleDescription = (index) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [showWarning, setShowWarning] = useState(true);
  
  const warningOpacity = useSharedValue(0);

  useEffect(() => {
    warningOpacity.value = withTiming(showWarning ? 1 : 0, { duration: 500 });
  }, [showWarning]);

  const animatedWarningStyle = useAnimatedStyle(() => {
    return {
      opacity: warningOpacity.value,
    };
  });
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
      {showWarning && (
        <Animated.View style={[styles.warningContainer, animatedWarningStyle]}>
          <Card style={styles.warningCard}>
            <Card.Title
              title="Warning"
              subtitle="Please be careful when using the recommended products/treatments."
              left={(props) => <IconButton {...props} icon="alert" color="red" />}
              right={(props) => (
                <IconButton {...props} icon="close" onPress={() => setShowWarning(false)} />
              )}
            />
          </Card>
        </Animated.View>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.recommendedContainer}
      >
        {recommendedItems.map((item, index) => {
          const isExpanded = expandedIndexes.includes(index);
          return (
            <View key={index} style={styles.recommendedItem}>
              <Image
                source={{ uri: item.imageUri }}
                style={styles.recommendedImage}
              />
              <Text style={styles.recommendedName}>{item.name}</Text>
              {/* <Text
                style={styles.recommendedDescription}
                onPress={() => toggleDescription(index)}
              >
                {isExpanded ? item.fullDescription : item.shortDescription}
                {!isExpanded && " ..."}
              </Text> */}
            </View>
          );
        })}
      </ScrollView>
      
    </View>
  );
};

export default PlantDetails;
