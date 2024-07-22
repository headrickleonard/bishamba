import * as ImagePicker from "expo-image-picker";
import { requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheet from "react-native-raw-bottom-sheet";
import { createPost } from "../api/index";
import { useAuth } from "../contexts/AuthContext";
import { TouchableRipple } from 'react-native-paper';

const screenWidth = Dimensions.get("window").width;

const PostCanvas = forwardRef((props, ref) => {
  const bottomSheetRef = useRef(null);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [description, setDescription] = useState("");
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.open();
    }
  };

  const openGallery = async () => {
    try {
      if (selectedMedia.length >= 2) {
        alert("You can only select up to 2 images.");
        return;
      }

      const media = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.POPOVER,
      });

      if (!media.canceled && !media.error && media.assets.length > 0) {
        if (selectedMedia.length + media.assets.length > 1) {
          alert("You can only select up to 2 images.");
          return;
        }

        setSelectedMedia((prevMedia) => [
          ...prevMedia,
          ...media.assets.slice(0, 2 - prevMedia.length),
        ]);
      }
    } catch (error) {
      console.error("Gallery Picker Error:", error);
    }
  };

  const requestPermissions = async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      console.error("Permission to access media library denied");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log("The description is:", description);
    console.log("The access token is:", accessToken);
    console.log("seletected media array:", selectedMedia);
    try {
      const response = await createPost(
        accessToken,
        description,
        selectedMedia
      );
      console.log("Post created successfully:", response);
      bottomSheetRef.current.close();
      setSelectedMedia([]);
      setDescription("");
    } catch (error) {
      console.error("Error creating post:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  React.useImperativeHandle(ref, () => ({
    openBottomSheet: openBottomSheet,
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={500}
      animationType="slide"
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0,0,0,0.3)",
        },
        draggableIcon: {
          backgroundColor: "#000",
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "#e6e6e6",
          padding: 20,
        },
      }}
    >
      {/* Image pad for selecting media */}
      <TouchableRipple onPress={openGallery} style={styles.imagePad}>
        {selectedMedia.length > 0 ? (
          <Image
            source={{ uri: selectedMedia[selectedMedia.length - 1].uri }}
            style={styles.selectedImage}
          />
        ) : (
          <Text style={styles.imagePadText}>Tap to select media</Text>
        )}
      </TouchableRipple>

      {/* Display selected images */}
      <View style={styles.imageContainer}>
        {selectedMedia.map((media, index) => (
          <Image
            key={index}
            source={{ uri: media.uri }}
            style={styles.selectedImage}
          />
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.submitButton, loading && styles.disabledButton]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Post</Text>
        )}
      </TouchableOpacity>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  imagePad: {
    width: "100%",
    height: 200,
    backgroundColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePadText: {
    color: "#888",
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  selectedImage: {
    width: screenWidth / 3 - 20,
    height: 100,
    resizeMode: "cover",
    borderRadius: 5,
    margin: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PostCanvas;
