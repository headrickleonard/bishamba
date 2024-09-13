import { useNavigation } from "@react-navigation/native";
import { ScanSearch, Leaf } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { Divider, Card, IconButton } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import OverviewItem from "./OverviewItem";

const { width } = Dimensions.get('window');

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
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [showWarning, setShowWarning] = useState(true);
  
  const warningOpacity = useSharedValue(1);

  useEffect(() => {
    warningOpacity.value = withTiming(showWarning ? 1 : 0, { duration: 500 });
  }, [showWarning]);

  const animatedWarningStyle = useAnimatedStyle(() => ({
    opacity: warningOpacity.value,
  }));

  const handleImagePress = (image, index) => {
    navigation.navigate("ImageViewer", { image, images });
  };

  const trimDescription = (description) => {
    const firstPeriodIndex = description.indexOf(".");
    return firstPeriodIndex === -1 ? description : description.substring(0, firstPeriodIndex + 1);
  };

  const recommendedItems = recommendedTreatment.map((item) => ({
    name: item.productName,
    fullDescription: item.description,
    shortDescription: trimDescription(item.description),
    imageUri: item.images[0],
  }));

  const toggleDescription = (index) => {
    setExpandedIndexes(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
        <Text style={styles.commonName}>{commonName}</Text>
        <Text style={styles.scientificName}>{scientificName}</Text>
        <TouchableOpacity
          style={styles.carePlanButton}
          activeOpacity={0.9}
        >
          <Leaf color="white" size={20} style={styles.carePlanIcon} />
          <Text style={styles.carePlanText}>Get Care Plan</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Related Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {images.map((image, index) => (
            <Pressable
              key={index}
              onPress={() => handleImagePress(image, index)}
              style={styles.imageContainer}
            >
              <Image source={{ uri: image }} style={styles.image} />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <ScanSearch color="black" size={24} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Plant Overview</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Treatments</Text>
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
          {recommendedItems.map((item, index) => (
            <View key={index} style={styles.recommendedItem}>
              <Image source={{ uri: item.imageUri }} style={styles.recommendedImage} />
              <Text style={styles.recommendedName}>{item.name}</Text>
              <TouchableOpacity onPress={() => toggleDescription(index)}>
                <Text style={styles.recommendedDescription}>
                  {expandedIndexes.includes(index) ? item.fullDescription : item.shortDescription}
                  {!expandedIndexes.includes(index) && " ..."}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  commonName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scientificName: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
  },
  carePlanButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 10,
  },
  carePlanIcon: {
    marginRight: 8,
  },
  carePlanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    marginRight: 10,
  },
  imageScroll: {
    marginTop: 10,
  },
  imageContainer: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 120,
    height: 120,
  },
  divider: {
    backgroundColor: '#E0E0E0',
    height: 1,
    marginVertical: 20,
  },
  overviewContainer: {
    marginTop: 10,
  },
  warningContainer: {
    marginBottom: 10,
  },
  warningCard: {
    backgroundColor: '#FFF3CD',
  },
  recommendedContainer: {
    marginTop: 10,
  },
  recommendedItem: {
    width: width * 0.7,
    marginRight: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
  },
  recommendedImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  recommendedName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recommendedDescription: {
    fontSize: 14,
    color: '#666',
  },
};

export default PlantDetails;