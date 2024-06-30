import { Camera, CameraType, FlashMode } from "expo-camera";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useIsFocused } from "@react-navigation/native"; // Import useFocusEffect and useIsFocused
import buttonIcon from "../assets/icons/button.png";
import BottomSheet from "react-native-raw-bottom-sheet";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import LoopText from "react-native-loop-text";
import CustomDialog from "../components/Dialog";
import { IconButton } from "react-native-paper";

export default function CameraScreen({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const bottomSheetRef = useRef();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [imageUri, setImageUri] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Custom dialog states
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);
  const isFocused = useIsFocused(); // Hook to determine if the screen is focused

  const showErrorDialog = () => setErrorDialogVisible(true);
  const showSuccessDialog = () => setSuccessDialogVisible(true);
  const hideErrorDialog = () => setErrorDialogVisible(false);
  const hideSuccessDialog = () => setSuccessDialogVisible(false);

  useFocusEffect(
    useCallback(() => {
      if (cameraRef.current) {
        cameraRef.current.resumePreview(); // Resume the camera preview when the screen gains focus
      }

      return () => {
        if (cameraRef.current) {
          cameraRef.current.pausePreview(); // Pause the camera preview when the screen loses focus
        }
      };
    }, [cameraRef])
  );

  const requestPermissions = async () => {
    const cameraPermission = await requestCameraPermissionsAsync();
    const mediaLibraryPermission = await requestMediaLibraryPermissionsAsync();

    if (
      cameraPermission.status !== "granted" ||
      mediaLibraryPermission.status !== "granted"
    ) {
      console.error("Permission to access camera or media library denied");
    }
  };

  const initializeCamera = async () => {
    if (!isCameraReady) {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === "granted") {
          setIsCameraReady(true);
        }
      } catch (error) {
        console.error("Error initializing camera:", error);
      }
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (isFocused) {
      initializeCamera(); // Reinitialize the camera when the screen gains focus
    }
  }, [isFocused]);

  const openGallery = async () => {
    try {
      const media = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!media.canceled) {
        setSelectedMedia(media.assets[0].uri);
        navigation.navigate("ScanDetails", { photo: media.assets[0].uri });
      }
    } catch (error) {
      console.error("Gallery Picker Error:", error);
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const options = {
          quality: 1, // Image quality (0 to 1)
          base64: true, // Return base64-encoded image data
          exif: true, // Include EXIF data (orientation, etc.)
        };

        const data = await cameraRef.current.takePictureAsync(options);
        console.log(data.uri);
        setImageUri(data.uri);
        navigation.navigate("ScanDetails", { photo: data.uri });
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  const handlePinchGesture = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const newZoom = Math.min(Math.max(event.nativeEvent.scale, 0), 1);
      setZoom(newZoom);
    }
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const Dialogger = () => (
    <View style={styles.container}>
      <IconButton
        icon="alert-circle"
        color="#FF5733"
        size={30}
        onPress={showErrorDialog}
      />
      <IconButton
        icon="check-circle"
        color="#33FF6B"
        size={30}
        onPress={showSuccessDialog}
      />

      <CustomDialog
        visible={errorDialogVisible}
        onDismiss={hideErrorDialog}
        type="error"
        message="An error occurred. Please try again."
      />

      <CustomDialog
        visible={successDialogVisible}
        onDismiss={hideSuccessDialog}
        type="success"
        message="Success! Action completed successfully."
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={handlePinchGesture}>
        <Camera
          style={styles.camera}
          type={type}
          zoom={zoom}
          ratio="1:1"
          ref={cameraRef}
          autoFocus
          onCameraReady={handleCameraReady}
        >
          <View style={styles.frame}>
            <BottomSheet
              ref={bottomSheetRef}
              closeOnDragDown={true}
              closeOnPressMask={true}
              height={600}
              animationType="slide"
              customStyles={{
                wrapper: {
                  backgroundColor: "transparent",
                },
                draggableIcon: {
                  backgroundColor: "#000",
                },
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  backgroundColor: "#e6e6e6",
                },
              }}
            >
              {selectedMedia && (
                <Image
                  source={{ uri: selectedMedia }}
                  className="w-40 h-40 rounded-lg m-1"
                />
              )}

              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  className="w-40 h-40 rounded-lg m-1"
                />
              )}
            </BottomSheet>
          </View>
        </Camera>
      </PinchGestureHandler>
      <View className="h-fit p-2">
        <LoopText
          textArray={["scan affected part..", "piga picha mmea wako.."]}
          className="text-white text-center font-bold text-xl rounded-full"
        />
      </View>
      <View className="flex flex-row items-center justify-evenly p-2 bg-green-500 py-8 rounded-t-3xl w-full">
        <TouchableOpacity onPress={openGallery}>
          <Image
            source={require("../assets/icons/thumbnail.png")}
            className=" h-12 w-12"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto}>
          <Image
            source={require("../assets/icons/button.png")}
            className=" h-12 w-12"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../assets/icons/info.png")}
            className=" h-12 w-12"
          />
          {/* <Dialogger /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  frame: {
    position: "absolute",
    top: "10%",
    left: "5%",
    width: "90%",
    height: "80%",
    bottom: "10%",
    borderColor: "green",
    borderWidth: 4,
    borderRadius: 40,
    zIndex: 10,
    borderStyle: "dashed",
  },
});
