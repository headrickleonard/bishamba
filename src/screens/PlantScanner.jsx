import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
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
import WarningAlert from "../components/result/WarningAlert";
import RBSheet from "react-native-raw-bottom-sheet";
import PlantsList from "../components/form/PlantsList";

const PlantScanner = ({ route, navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const { photoUri } = route.params;
  const [status, setStatus] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const analyzingOpacity = useSharedValue(0);
  const detectingOpacity = useSharedValue(0);
  const identifyingOpacity = useSharedValue(0);
  const fadeOutOpacity = useSharedValue(1);
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
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  // useEffect(() => {
  //   refRBSheet.current.open();
  // }, []);
  //   const handleScan = async () => {
  //     setIsScanning(true);
  //     setStatus("Analyzing image...");
  //     setSteps({ analyzing: true, detecting: false, identifying: false });

  //     setTimeout(() => {
  //       setStatus("Detecting leaves...");
  //       setSteps({ analyzing: true, detecting: true, identifying: false });

  //       setTimeout(() => {
  //         setStatus("Identifying plant...");
  //         setSteps({ analyzing: true, detecting: true, identifying: true });

  //         setTimeout(() => {
  //           setStatus("Plant identified!");
  //           setIsScanning(false);
  //           // Reset steps to initial state after the analysis is complete
  //           setSteps({ analyzing: false, detecting: false, identifying: false });
  //         }, 2000);
  //       }, 2000);
  //     }, 2000);
  //   };

  const handleScan = async () => {
    setIsScanning(true);
    setStatus("Analyzing image...");
    setSteps({ analyzing: true, detecting: false, identifying: false });
    analyzingOpacity.value = 1;

    setTimeout(() => {
      setStatus("Detecting leaves...");
      setSteps({ analyzing: true, detecting: true, identifying: false });
      detectingOpacity.value = 1;

      setTimeout(() => {
        setStatus("Identifying plant...");
        setSteps({ analyzing: true, detecting: true, identifying: true });
        identifyingOpacity.value = 1;

        setTimeout(() => {
          setStatus("Plant identified!");
          setIsScanning(false);
          // Fade out the steps in reverse order
          identifyingOpacity.value = withTiming(0, { duration: 500 }, () => {
            detectingOpacity.value = withTiming(0, { duration: 500 }, () => {
              analyzingOpacity.value = withTiming(0, { duration: 500 }, () => {
                runOnJS(navigation.navigate)("Results", {
                  plantName: "Janda Bolong",
                  plantDetails: "Detailed information about Janda Bolong.",
                  photoUri,
                });
              });
            });
          });
        }, 2000);
      }, 2000);
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
          {/* <View style={styles.header}>
            <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8}>
              <Ionicons name="close" size={24} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8}>
              <Ionicons name="information" size={24} color={"white"} />
            </TouchableOpacity>
          </View> */}
          {/* <Text style={styles.statusMessage} className="font-bold">
            Janda Bolong
          </Text> */}
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
            // onPress={()=>{refRBSheet.current.open()}}
            onPress={handleScan}
            disabled={isScanning}
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
      {/* <TouchableOpacity
        style={styles.scanButton}
        activeOpacity={0.9}
        // onPress={()=>{refRBSheet.current.open()}}
        onPress={handleScan}
        disabled={isScanning}
      >
        {isScanning ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        ) : (
          <Text style={styles.scanButtonText}>Start Analysis</Text>
        )}
      </TouchableOpacity> */}
      {/* <WarningAlert /> */}
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
    height: 550,
    width: "100%",
    // backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: 150,
  },
  header: {
    height: 48,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 24,
  },
  headerIcon: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 24,
    height: 48,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  scannedImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover", //i will use contain later contain
    marginBottom: 16,
    borderRadius: 24,

    // borderWidth: 4,
    // borderColor: "#ccc",
    // borderRadius: 16,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    // overflow: "hidden",
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
    backgroundColor: "#32c759", // green-500
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop:30
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  stepsContainer: {
    marginTop: -60,
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
  // imageContainer: {
  //   width: 320,
  //   height: 320,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginBottom: 16,
  //   borderWidth: 4,
  //   borderColor: "#ccc",
  //   borderRadius: 16,
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  //   overflow: "hidden",
  // },
});

export default PlantScanner;
