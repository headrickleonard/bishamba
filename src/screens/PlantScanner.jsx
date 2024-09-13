import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withSpring,
  withRepeat,
} from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import LottieView from "lottie-react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import PlantsList from "../components/form/PlantsList";
import { uploadImageForPrediction, makePrediction, postToCommunity } from "../api";
import { insertDisease, getTableSchema, createTable } from "../db/database";
import { storePlantId } from "../utils";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const { width } = Dimensions.get('window');
const imageSize = width * 0.8;

const PlantScanner = ({ route, navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const { photoUri } = route.params;
  const [status, setStatus] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const progress = useSharedValue(0);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const refRBSheet = useRef();
  const failedScanSheetRef = useRef();

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const imageScale = useSharedValue(1);
  const blurIntensity = useSharedValue(0);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const blurStyle = useAnimatedStyle(() => ({
    opacity: blurIntensity.value,
  }));

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleScan = useCallback(async () => {
    if (!selectedPlant) {
      refRBSheet.current.open();
      return;
    }

    setIsScanning(true);
    setStatus("Analyzing plant...");
    progress.value = withTiming(0.33, { duration: 1000 });
    buttonScale.value = withSpring(0.95);
    imageScale.value = withRepeat(withTiming(1.05, { duration: 1000 }), -1, true);
    blurIntensity.value = withTiming(1, { duration: 500 });

    try {
      setStatus("Uploading to server...");
      progress.value = withTiming(0.66, { duration: 1000 });

      const imageUrl = await uploadImageForPrediction(photoUri);
      setStatus("Generating report...");
      const predictionData = await makePrediction(selectedPlant.id, imageUrl);

      if (predictionData.status === "failed") {
        throw new Error(predictionData.message || "Scan failed");
      }

      console.log("the prediction results are:", predictionData.data);
      console.log("the disease id here is:", predictionData.data.diseaseId);
      
      storePlantId(predictionData.data.diseaseId);

      progress.value = withTiming(1, { duration: 1000 });

      setTimeout(() => {
        setStatus("Plant identified!");
        buttonScale.value = withSpring(1);

        setTimeout(() => {
          setIsScanning(false);
          progress.value = withTiming(0, { duration: 500 }, () => {
            runOnJS(navigation.navigate)("Results", {
              details: {
                imageUrl,
                data: predictionData.data,
              },
            });
          });
        }, 1000);
      }, 1000);
    } catch (error) {
      console.error("Error during analysis:", error);
      setStatus("Scan unsuccessful. Please try again or ask the community.");
      progress.value = withTiming(0, { duration: 500 });
      setIsScanning(false);
      buttonScale.value = withSpring(1);
      failedScanSheetRef.current.open();
    }
  }, [selectedPlant, photoUri, navigation, progress, buttonScale, imageScale, blurIntensity]);

  const handleCommunityPost = async (description) => {
    try {
      await postToCommunity(photoUri, description, selectedPlant?.name);
      failedScanSheetRef.current.close();
      // Navigate to community feed or show success message
    } catch (error) {
      console.error("Error posting to community:", error);
      // Show error message to user
    }
  };

  const handleSelectPlant = useCallback((plant) => {
    setSelectedPlant(plant);
    refRBSheet.current.close();
  }, []);

  const openPlantSelection = useCallback(() => {
    refRBSheet.current.open();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedLinearGradient
        colors={['#e6e6e6', '#fff']}
        style={StyleSheet.absoluteFill}
      />
      {photoUri && (
        <View style={styles.contentContainer}>
          <View style={styles.plantSelectionContainer}>
            <Text style={styles.statusMessage}>
              {selectedPlant ? selectedPlant.name : "No plant selected"}
            </Text>
            <TouchableOpacity onPress={openPlantSelection} style={styles.reselectButton}>
              <Ionicons name="refresh-outline" size={24} color="#32c759" />
            </TouchableOpacity>
          </View>
          <View style={styles.imageContainer}>
            <Animated.Image 
              source={{ uri: photoUri }} 
              style={[styles.scannedImage, imageStyle]} 
            />
            <AnimatedBlurView intensity={5} style={[StyleSheet.absoluteFill, blurStyle]} />
            {isScanning && (
              <LottieView
                source={require("../assets/anime/scan.json")}
                autoPlay
                loop
                style={styles.lottieOverlay}
              />
            )}
            <LinearGradient
              colors={['rgba(168, 224, 99, 0)', 'rgba(86, 171, 47, 0.3)']}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <Animated.View style={[styles.progressBar, progressStyle]} />
          <TouchableOpacity
            style={styles.scanButton}
            activeOpacity={0.8}
            onPress={handleScan}
          >
            <Animated.View style={[styles.buttonContent, buttonStyle]}>
              {isScanning ? (
                <Text style={styles.statusText}>{status}</Text>
              ) : (
                <Text style={styles.scanButtonText}>Start Analysis</Text>
              )}
            </Animated.View>
          </TouchableOpacity>
        </View>
      )}

      <RBSheet
        ref={refRBSheet}
        height={600}
        openDuration={250}
        dragFromTopOnly={true}
        closeOnDragDown
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: '#f0f8ff',
          },
          draggableIcon: {
            backgroundColor: "#56ab2f",
          },
        }}
      >
        <PlantsList onSelectPlant={handleSelectPlant} />
      </RBSheet>

      <RBSheet
        ref={failedScanSheetRef}
        height={400}
        openDuration={250}
        dragFromTopOnly={true}
        closeOnDragDown
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: '#f0f8ff',
          },
          draggableIcon: {
            backgroundColor: "#56ab2f",
          },
        }}
      >
        <View style={styles.failedScanSheet}>
          <Text style={styles.failedScanTitle}>Scan Unsuccessful</Text>
          <Text style={styles.failedScanMessage}>We couldn't identify the plant. What would you like to do?</Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.retryButton} onPress={() => {
            failedScanSheetRef.current.close();
            handleScan();
          }}>
            <Text style={styles.buttonText}>Retry Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.communityButton} onPress={() => {
            failedScanSheetRef.current.close();
            navigation.navigate("AskCommunity", { photoUri, plantName: selectedPlant?.name });
          }}>
            <Text style={styles.buttonText}>Ask Community</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  plantSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusMessage: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    textAlign: 'center',
    marginRight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  reselectButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  imageContainer: {
    width: imageSize,
    height: imageSize,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    marginBottom: 30,
  },
  scannedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  progressBar: {
    height: 4,
    backgroundColor: '#56ab2f',
    borderRadius: 2,
    marginBottom: 20,
  },
  scanButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#32c759",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statusText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  lottieOverlay: {
    ...StyleSheet.absoluteFill,
  },
  failedScanSheet: {
    padding: 20,
    alignItems: 'center',
  },
  failedScanTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  failedScanMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  retryButton: {
    backgroundColor: '#56ab2f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  communityButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlantScanner;