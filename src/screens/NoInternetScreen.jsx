import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar"; 

const NoInternetScreen = ({ retryConnection }) => {
  const openNetworkSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      Alert.alert("Error", "Unable to open network settings");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.messageContainer}>
        <Image
          source={require("../assets/icons/signal.png")}
          style={styles.image}
        />
        <Text style={styles.title}>You're offline!</Text>
        <Text style={styles.message}>
          It seems there's a problem with your connection. Please check your
          network status.
        </Text>
        {/* <Pressable onPress={retryConnection} style={styles.retryButton}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable> */}
        <Pressable onPress={openNetworkSettings} style={styles.retryButton}>
          <Text style={styles.settingsText}>Open Network Settings</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#f8f8f8", // Ensure background color for visibility
  },
  messageContainer: {
    width: "100%",
    height: "40%",
    backgroundColor: "rgba(200, 200, 200, 0.1)",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    position: "absolute",
    bottom: 20, // Adjust bottom position
  },
  image: {
    height: 48,
    width: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#242424",
  },
  message: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center", // Adjust text alignment
    marginBottom: 20,
    color: "#242424",
  },
  retryButton: {
    height: 48,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#28a745", // Green color for the button
    marginBottom: 10,
  },
  retryText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  settingsButton: {
    height: 48,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#007bff", // Blue color for the button
  },
  settingsText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NoInternetScreen;
