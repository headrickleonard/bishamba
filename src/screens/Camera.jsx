import { Camera, CameraType, FlashMode } from "expo-camera";
import { useState, useRef, useEffect } from "react";
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
import buttonIcon from "../assets/icons/button.png";
import { requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "react-native-raw-bottom-sheet";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import LoopText from "react-native-loop-text";

export default function CameraScreen({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const bottomSheetRef = useRef();
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [zoom, setZoom] = useState(0);
  const [imageUri, setImageUri] = useState(null);

  // if (!permission) {
  //   // Camera permissions are still loading
  //   return <View />;
  // }

  const requestPermissions = async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      console.error("Permission to access media library denied");
    }
  };
  useEffect(() => {
    requestPermissions();
  }, []);
  const openGallery = async () => {
    try {
      const media = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        quality: 1,
        // allowsMultipleSelection: true,//allowsEditing cannot be done when allowsMultipleSelection is set to true
        // selectionLimit: 6,
      });

      setSelectedMedia(media.assets[0].uri);

      console.log(selectedMedia);

      if (!media.canceled || !media.error) {
        // setSelectedMedia([...selectedMedia, ...media.selected]);
        // setSelectedMedia(media.assets[0].uri);
        bottomSheetRef.current.open();
      }
      setImageUri(null);
    } catch (error) {
      // console.error("Gallery Picker Error:", error);
      console.error(new Error(error));
    }
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  // async function takePhoto() {
  //   if (cameraRef.current) {
  //     try {
  //       const { uri } = await cameraRef.current.takePictureAsync();
  //       const asset = await MediaLibrary.createAssetAsync(uri);
  //       Alert.alert("Success", "Photo saved to gallery");
  //     } catch (error) {
  //       Alert.alert("Error", "Failed to take photo");
  //     }
  //     console.log("captured..");
  //   }
  // }

  // const takePhoto = async () => {
  //   if (cameraRef.current) {
  //     try {
  //       const { uri } = await cameraRef.current.takePictureAsync();
  //       setSelectedMedia(uri); // Set the selectedMedia state with the captured image URI
  //       bottomSheetRef.current.open(); // Open the bottom sheet after taking the picture
  //       console.log('Success', 'Photo saved to gallery');
  //     } catch (error) {
  //       // Alert.alert('Error', 'Failed to take photo');
  //       console.log('Error', 'Failed to take photo');
  //     }
  //   }
  // };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const options = {
          quality: 1, // Image quality (0 to 1)
          base64: true, // Return base64-encoded image data
          exif: true, // Include EXIF data (orientation, etc.)
        };

        const data = await cameraRef.current.takePictureAsync(options);
        console.log(data.uri);
        setImageUri(data.uri);
        bottomSheetRef.current.open();
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };
  async function getPhotoInfo() {
    if (cameraRef.current) {
      try {
        const { width, height, orientation } =
          await cameraRef.current.getCameraInfo();
        Alert.alert(
          "Photo Info",
          `Width: ${width}, Height: ${height}, Orientation: ${orientation}`
        );
      } catch (error) {
        Alert.alert("Error", "Failed to get photo info");
      }
    }
  }

  //   async function toggleFlashlight() {
  //     try {
  //       await Camera.setFlashModeAsync(
  //         type === Camera.Constants.Type.back
  //           ? Camera.Constants.FlashMode.torch
  //           : Camera.Constants.FlashMode.off
  //       );
  //     } catch (error) {
  //       Alert.alert("Error", "Failed to toggle flashlight");
  //     }
  //   }
  async function toggleFlashlight() {
    try {
      await Camera.getCameraPermissionsAsync(); // Ensure camera permissions are granted
      await Camera.getCameraPermissionsAsync(); // Ensure camera permissions are granted
      await Camera.setFlashModeAsync(
        type === CameraType.back ? FlashMode.torch : FlashMode.off
      );
    } catch (error) {
      Alert.alert("Error", "Failed to toggle flashlight");
    }
  }
  const handlePinchGesture = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const newZoom = Math.min(Math.max(event.nativeEvent.scale, 0), 1);
      setZoom(newZoom);
    }
  };

  return (
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={handlePinchGesture}>
        <Camera
          style={styles.camera}
          type={type}
          zoom={zoom}
          ratio="1:1"
          ref={cameraRef}
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
              {selectedMedia ? (
                <Image
                  source={{ uri: selectedMedia }}
                  className="w-40 h-40 rounded-lg m-1"
                />
              ) : (
                ""
              )}

              <Image
                source={{ uri: imageUri }}
                className="w-40 h-40 rounded-lg m-1"
              />
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
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems:"center",
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
