import React, { useRef } from "react";
import { BlurView } from "expo-blur";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PRIMARY_COLOR } from "../styles/styles";
import PostCanvas from "./PostCanvas";

const CustomHeader = ({ navigation, title, showCreateIcon }) => {
  const postCanvasRef = useRef(null);

  const openBottomSheet = () => {
    if (postCanvasRef.current) {
      postCanvasRef.current.openBottomSheet();
    }
  };

  return (
    <>
      <BlurView intensity={50} style={styles.headerBackground}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" color="white" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || "Plant Details"}</Text>
        {showCreateIcon && (
          <TouchableOpacity onPress={openBottomSheet} style={styles.createButton}>
            <Ionicons name="create-outline" color="#000" size={24} />
          </TouchableOpacity>
        )}
      </BlurView>
      <PostCanvas ref={postCanvasRef} />
    </>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 32,
  },
  headerTitle: {
    color: PRIMARY_COLOR,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  createButton: {
    position: "absolute",
    right: 24,
    top: 36,
  },
});

export default CustomHeader;
