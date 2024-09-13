import React, { useState, useRef, useCallback, useMemo } from "react";
import { Camera, CameraType } from "expo-camera";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Modal,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function CameraScreen({ navigation }) {
  const [type] = useState(CameraType.back);
  const cameraRef = useRef(null);
  const [zoom, setZoom] = useState(0);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const isFocused = useIsFocused();

  const buttonScale = useSharedValue(1);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (cameraRef.current) {
        cameraRef.current.resumePreview();
      }
      return () => {
        if (cameraRef.current) {
          cameraRef.current.pausePreview();
        }
      };
    }, [cameraRef])
  );

  const takePhoto = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const data = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
          exif: true,
        });
        navigation.navigate("PlantScanner", { photoUri: data.uri });
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };
  
  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        navigation.navigate("PlantScanner", { photoUri: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Gallery Picker Error:", error);
    }
  };

  const handlePinchGesture = useCallback(({ nativeEvent }) => {
    setZoom(interpolate(
      nativeEvent.scale,
      [1, 2],
      [0, 1],
      Extrapolate.CLAMP
    ));
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(buttonScale.value) }],
  }));

  const handlePressIn = useCallback(() => {
    buttonScale.value = 0.9;
  }, []);

  const handlePressOut = useCallback(() => {
    buttonScale.value = 1;
  }, []);

  const toggleInfoModal = () => {
    setIsInfoModalVisible(!isInfoModalVisible);
  };

  const memoizedCamera = useMemo(() => (
    <PinchGestureHandler onGestureEvent={handlePinchGesture}>
      <Camera
        style={styles.camera}
        type={type}
        zoom={zoom}
        ratio="16:9"
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
      </Camera>
    </PinchGestureHandler>
  ), [type, zoom, cameraRef, handlePinchGesture]);

  if (!isFocused) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {memoizedCamera}
      <View style={styles.overlay}>
        <Text style={styles.instructionText}>
          Scan affected part of your plant
        </Text>
        <Text style={styles.hintText}>
          Tip: Focus on the affected area and ensure good lighting
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={openGallery} style={styles.iconButton}>
            <MaterialCommunityIcons name="image" size={30} color="white" />
          </TouchableOpacity>
          <AnimatedTouchableOpacity
            onPress={takePhoto}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.captureButton, animatedButtonStyle]}
          >
            <View style={styles.captureButtonInner} />
          </AnimatedTouchableOpacity>
          <TouchableOpacity onPress={toggleInfoModal} style={styles.iconButton}>
            <MaterialCommunityIcons name="information" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isInfoModalVisible}
        onRequestClose={toggleInfoModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Camera Usage Tips</Text>
              <Text style={styles.modalText}>1. Ensure good lighting for clear images.</Text>
              <Text style={styles.modalText}>2. Hold the camera steady to avoid blur.</Text>
              <Text style={styles.modalText}>3. Focus on the affected area of the plant.</Text>
              <Text style={styles.modalText}>4. Capture the entire leaf or plant part if possible.</Text>
              <Text style={styles.modalText}>5. Avoid shadows on the plant.</Text>
              <Text style={styles.modalText}>6. Take multiple photos from different angles for best results.</Text>
            </ScrollView>
            <TouchableOpacity onPress={toggleInfoModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  instructionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  hintText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});