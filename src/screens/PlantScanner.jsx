import React, { useState, useEffect } from "react";
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
} from "react-native-reanimated";

const PlantScanner = ({ route }) => {
  const [isScanning, setIsScanning] = useState(false);
  const { photoUri } = route.params;
  const [status, setStatus] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const analyzingOpacity = useSharedValue(0);
  const detectingOpacity = useSharedValue(0);
  const identifyingOpacity = useSharedValue(0);

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
          // Reset steps to initial state after the analysis is complete
          setSteps({ analyzing: false, detecting: false, identifying: false });
          analyzingOpacity.value = 0;
          detectingOpacity.value = 0;
          identifyingOpacity.value = 0;
        }, 2000);
      }, 2000);
    }, 2000);
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
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="close" size={24} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="information" size={24} color={"white"} />
            </TouchableOpacity>
          </View>
          <Text style={styles.statusMessage}>Janda Bolong</Text>
          <Image source={{ uri: photoUri }} style={styles.scannedImage} />
          <TouchableOpacity
            style={styles.scanButton}
            activeOpacity={0.9}
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

      {/* <View style={styles.stepsContainer}>
        <View style={styles.step}>
          {steps.analyzing && (
            <Ionicons name="checkmark-circle" size={24} color="green" />
          )}
          <Text style={styles.stepText}>Analyzing image</Text>
        </View>
        <View style={styles.step}>
          {steps.detecting && (
            <Ionicons name="checkmark-circle" size={24} color="green" />
          )}
          <Text style={styles.stepText}>Detecting leaves</Text>
        </View>
        <View style={styles.step}>
          {steps.identifying && (
            <Ionicons name="checkmark-circle" size={24} color="green" />
          )}
          <Text style={styles.stepText}>Identifying plant</Text>
        </View>
      </View> */}

      <View style={styles.stepsContainer}>
        <Animated.View style={[styles.step, analyzingStyle]}>
          {steps.analyzing && (
            <Ionicons name="checkmark-circle" size={24} color="green" />
          )}
          <Text style={styles.stepText}>Analyzing image</Text>
        </Animated.View>
        <Animated.View style={[styles.step, detectingStyle]}>
          {steps.detecting && (
            <Ionicons name="checkmark-circle" size={24} color="green" />
          )}
          <Text style={styles.stepText}>Detecting leaves</Text>
        </Animated.View>
        <Animated.View style={[styles.step, identifyingStyle]}>
          {steps.identifying && (
            <Ionicons name="checkmark-circle" size={24} color="green" />
          )}
          <Text style={styles.stepText}>Identifying plant</Text>
        </Animated.View>
      </View>
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
    height: 500,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 12,
  },
  header: {
    height: 48,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 16,
    borderRadius: 24,
  },
  statusMessage: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
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
    backgroundColor: "#38a169", // green-500
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  stepsContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
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
});

export default PlantScanner;
