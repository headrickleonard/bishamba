import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import PlantsList from "../components/form/PlantsList";
import { uploadImageForPrediction, makePrediction } from "../api";
import { insertDisease, getTableSchema, createTable } from "../db/database";

const PlantScanner = ({ route, navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const { photoUri } = route.params;
  const [status, setStatus] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const analyzingOpacity = useSharedValue(0);
  const detectingOpacity = useSharedValue(0);
  const identifyingOpacity = useSharedValue(0);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const refRBSheet = useRef();

  const analyzingStyle = useAnimatedStyle(() => ({
    opacity: withTiming(analyzingOpacity.value, { duration: 500 }),
  }));
  const detectingStyle = useAnimatedStyle(() => ({
    opacity: withTiming(detectingOpacity.value, { duration: 500 }),
  }));
  const identifyingStyle = useAnimatedStyle(() => ({
    opacity: withTiming(identifyingOpacity.value, { duration: 500 }),
  }));

  const [steps, setSteps] = useState({
    analyzing: false,
    detecting: false,
    identifying: false,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    createTable();
  }, []);

  const handleScan = async () => {
    if (!selectedPlant) {
      refRBSheet.current.open();
      return;
    }

    setIsScanning(true);
    setStatus("Analyzing plant...");
    setSteps({ analyzing: true, detecting: false, identifying: false });
    analyzingOpacity.value = 1;

    setTimeout(async () => {
      setStatus("Uploading to server...");
      analyzingOpacity.value = withTiming(0, { duration: 500 }, () => {
        detectingOpacity.value = withTiming(1, { duration: 500 });
      });

      try {
        const imageUrl = await uploadImageForPrediction(photoUri);
        setStatus("Generating report...");
        const predictionData = await makePrediction(selectedPlant.id, imageUrl);
        console.log("the prediction results are:", predictionData.data);

        // Uncomment and use this if you want to store disease in local db
        // insertDisease({
        //   diseaseId: predictionData.data.diseaseId,
        //   diseasesCode: predictionData.data.diseasesCode,
        //   commonName: predictionData.data.commonName,
        //   scientificName: predictionData.data.scientificName,
        //   cause: predictionData.data.cause,
        //   category: predictionData.data.category,
        //   symptoms: predictionData.data.symptoms,
        //   comment: predictionData.data.comment,
        //   management: predictionData.data.management,
        //   recommendedTreatment: predictionData.data.recommendedTreatment,
        //   imageUri: imageUrl,
        // });

        setTimeout(() => {
          setStatus("Plant identified!");
          setSteps({ analyzing: true, detecting: true, identifying: true });
          detectingOpacity.value = withTiming(0, { duration: 500 }, () => {
            identifyingOpacity.value = withTiming(1, { duration: 500 });
          });

          setTimeout(() => {
            setIsScanning(false);
            identifyingOpacity.value = withTiming(0, { duration: 500 }, () => {
              // runOnJS(() => {
              //   navigation.navigate("Results", {
              //     plantName: predictionData.plantName,
              //     plantDetails: predictionData.plantDetails,
              //     photoUri,
              //   });
              // })();
              runOnJS(navigation.navigate)("Results", {
                details: {
                  imageUrl,
                  data: {
                    commonName: predictionData.data.commonName,
                    scientificName: predictionData.data.scientificName,
                    images: predictionData.data.images,
                    symptoms: predictionData.data.symptoms,
                    management: predictionData.data.management,
                    recommendedTreatment:
                      predictionData.data.recommendedTreatment,
                    cause: predictionData.data.cause,
                  },
                },
              });
            });
          }, 2000);
        }, 2000);
      } catch (error) {
        console.error("Error during analysis:", error);
        setStatus("Error identifying plant. Please try again.");
        setSteps({ analyzing: false, detecting: false, identifying: false });
        detectingOpacity.value = withTiming(0, { duration: 500 });
        identifyingOpacity.value = withTiming(0, { duration: 500 });
        setIsScanning(false);
      }
    }, 2000);
  };

  const handleSelectPlant = (plant) => {
    setSelectedPlant(plant);
    refRBSheet.current.close();
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {photoUri && (
        <View style={styles.headerContainer}>
          <Text style={styles.statusMessage} className="font-bold">
            {selectedPlant ? selectedPlant.name : "No plant selected"}
          </Text>
          <View style={styles.imageContainer}>
            <Image source={{ uri: photoUri }} style={styles.scannedImage} />
            {isScanning && (
              <LottieView
                source={require("../assets/anime/scan.json")}
                autoPlay
                loop
                style={styles.lottieOverlay}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.scanButton}
            activeOpacity={0.9}
            onPress={handleScan}
          >
            {isScanning ? (
              <View style={styles.statusContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.statusText}>{status}</Text>
              </View>
            ) : (
              <Text style={styles.scanButtonText}>Start Analysis</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.stepsContainer}>
        <Animated.View style={[styles.step, analyzingStyle]}>
          {steps.analyzing && (
            <Ionicons name="checkmark-circle" size={24} color="#32c759" />
          )}
          <Text style={styles.stepText}>Analyzing image</Text>
        </Animated.View>
        <Animated.View style={[styles.step, detectingStyle]}>
          {steps.detecting && (
            <Ionicons name="checkmark-circle" size={24} color="#32c759" />
          )}
          <Text style={styles.stepText}>Detecting leaves</Text>
        </Animated.View>
        <Animated.View style={[styles.step, identifyingStyle]}>
          {steps.identifying && (
            <Ionicons name="checkmark-circle" size={24} color="#32c759" />
          )}
          <Text style={styles.stepText}>Identifying plant</Text>
        </Animated.View>
      </View>

      <RBSheet
        ref={refRBSheet}
        height={600}
        openDuration={250}
        dragFromTopOnly={true}
        closeOnDragDown
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            elevation: 20,
          },
          draggableIcon: {
            backgroundColor: "#dedede",
          },
        }}
      >
        <PlantsList onSelectPlant={handleSelectPlant} />
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
  },
  headerContainer: {
    padding: 20,
    alignItems: "center",
    width: "100%",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: 120,
  },
  scannedImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    marginBottom: 16,
    borderRadius: 24,
  },
  statusMessage: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    marginBottom: 24,
  },
  statusContainer: {
    display: "flex",
    marginTop: -4,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  statusText: {
    fontSize: 16,
    marginTop: 8,
    color: "#fff",
    fontWeight: "500",
  },
  scanButton: {
    width: "80%",
    height: 48,
    backgroundColor: "#32c759",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  stepsContainer: {
    marginTop: 0,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stepText: {
    fontSize: 16,
    marginLeft: 8,
  },
  imageContainer: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
});

export default PlantScanner;
