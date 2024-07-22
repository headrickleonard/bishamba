import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const ImageViewer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { image, images } = route.params;

  const [selectedImage, setSelectedImage] = useState(image);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const handleImagePress = (img) => {
    setSelectedImage(img);
    navigation.navigate("ImageViewer", { image: img, images });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
      <Animated.Image
        source={{ uri: selectedImage }}
        style={[styles.mainImage, animatedStyle]}
      />
      <ScrollView horizontal style={styles.thumbnailContainer}>
        {images.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => handleImagePress(img)}>
            <Image
              source={{ uri: img }}
              style={[
                styles.thumbnail,
                selectedImage === img && styles.selectedThumbnail,
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  closeText: {
    color: "white",
    fontSize: 18,
  },
  mainImage: {
    width,
    height: height * 0.7,
    resizeMode: "contain",
  },
  thumbnailContainer: {
    position: "absolute",
    bottom: 72,
    left: 0,
    right: 0,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: "green",
  },
});

export default ImageViewer;
