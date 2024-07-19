import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable
} from "react-native";

const NoInternetScreen = ({ retryConnection }) => {
  return (
    <View style={styles.container}>
      <View className="w-full h-[40%] absolute bottom-8 bg-slate-200/10 p-2 rounded-xl">
        <Image
          source={require("../assets/icons/signal.png")}
          className="h-12 w-12"
        />
        <Text style={styles.title}>You're offline!</Text>
        <Text style={styles.message}>
          It seems there's a problem with your connection.Please check your
          network status
        </Text>
        <Pressable
          onPress={retryConnection}
          className="h-12 flex flex-row items-center justify-center p-2 w-full rounded-lg bg-green-500"
        >
          <Text className="font-semibold text-lg text-white">Try again</Text>
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
    paddingHorizontal:20
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
    textAlign: "left",
    marginBottom: 20,
    color: "#242424",
  },
});

export default NoInternetScreen;
