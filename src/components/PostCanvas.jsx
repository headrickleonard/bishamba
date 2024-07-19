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
import Carousel from "react-native-reanimated-carousel";
import { createPost } from "../api/index";
import { useAuth } from "../contexts/AuthContext";

const screenWidth = Dimensions.get("window").width;

const PostCanvas = forwardRef((props, ref) => {
  const bottomSheetRef = useRef(null);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [content, setContent] = useState("");
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
      const media = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // quality: 1,
        // selectionLimit:3,
        // allowsMultipleSelection:true,

        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.POPOVER,
      });

      if (!media.canceled && !media.error) {
        setSelectedMedia((prevMedia) => [...prevMedia, media.assets[0]]);
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
    console.log("The content is:", content);
    console.log("the access token is:", accessToken);
    try {
      const response = await createPost(
        accessToken,
        description,
        selectedMedia
      );
      console.log("Post created successfully:", response);
      // Close bottom sheet and reset form
      bottomSheetRef.current.close();
      setSelectedMedia([]);
      setContent("");
      setDescription("");
    } catch (error) {
      console.error("Error creating post:", error.message);
    } finally {
      setLoading(false);
    }
  };

  //   const handleSubmit = async () => {
  //     setLoading(true);

  //     console.log("selected images are:", selectedMedia);
  //     try {
  //       console.log("Uploading images...");
  //       const imageUploadPromises = selectedMedia.map((image) =>
  //         uploadImage(image.uri)
  //       );
  //       const imageUrls = await Promise.all(imageUploadPromises);
  //       console.log("Images uploaded successfully:", imageUrls);

  //       bottomSheetRef.current.close();
  //       setSelectedMedia([]);
  //       setContent("");
  //       setDescription("");
  //     } catch (error) {
  //       console.error("Error uploading images:", error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  useEffect(() => {
    requestPermissions();
  }, []);

  // Expose the openBottomSheet function through ref forwarding
  React.useImperativeHandle(ref, () => ({
    openBottomSheet: openBottomSheet,
  }));

  const renderCarouselItem = ({ item, index }) => (
    <Image
      key={index}
      source={{ uri: item.uri }}
      style={styles.carouselImage}
    />
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={600}
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
      <TouchableOpacity onPress={openGallery} style={styles.selectMediaButton}>
        <Text>Select Media</Text>
      </TouchableOpacity>
      {selectedMedia.length > 0 ? (
        <>
          <Carousel
            width={screenWidth - 40}
            height={200}
            data={selectedMedia}
            renderItem={renderCarouselItem}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            panGestureHandlerProps={{
              activeOffsetX: [-10, 10],
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
        </>
      ) : (
        <View style={styles.stylishTextContainer}>
          <TextInput
            style={styles.stylishText}
            placeholder="Your text post will appear here"
            value={content}
            onChangeText={setContent}
            multiline
          />
        </View>
      )}
      <TouchableOpacity
        onPress={() => handleSubmit()}
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
  selectMediaButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  stylishTextContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  stylishText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
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
  closeButton: {
    backgroundColor: "#f00",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  carouselImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default PostCanvas;
