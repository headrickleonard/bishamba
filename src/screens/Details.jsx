import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../const/colors";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { PRIMARY_COLOR } from "../styles/styles";
import { sendNotification } from "../api";
import { useAuth } from "../contexts/AuthContext";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";

const Details = ({ navigation, route }) => {
  const { accessToken } = useAuth();
  const product = route.params;
  const [value, setValue] = React.useState(1);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleConnect = () => {
    if (accessToken) {
      sendNotificationToShopOwner();
    } else {
      navigation.navigate("Auth", { returnScreen: "Details" });
    }
  };

  const sendNotificationToShopOwner = async () => {
    console.log(`Sending notification about ${product.name} to shop owner`);
    const notificationData = {
      shopId: product.shopId, // Replace with actual shop ID
      productId: product.id,
      quantity: value,
      totalPrice: product.price * value,
      userLocation: "New Mbalizi", // Replace with actual user location
      notificationChannel: "SMS",
      notificationType: "EXTERNAL",
      imageUrl: product.images.main,
    };

    try {
      const response = await sendNotification(notificationData, accessToken);
      Toast.show({
        type: "success",
        text1: "Notification sent successfully.",
        text2: "The shop owner will get to you soon",
      });
      console.log("Notification sent successfully:", response);
    } catch (error) {
      console.error("Error sending notification:", error);
      Toast.show({
        type: "Error",
        text1: "Failed to send notification.",
        text2: "Please re-try if the issue persists visit our help center",
      });
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <ScreenWrapper>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}
      >
        <View style={style.header}>
          <Pressable className="bg-neutral-400/20 rounded-full p-2">
            <Icon
              name="arrow-back"
              size={24}
              onPress={() => navigation.goBack()}
            />
          </Pressable>
          <Pressable className="bg-neutral-400/10 rounded-full p-2">
            <Icon name="shopping-cart" size={24} />
          </Pressable>
        </View>
        <View style={style.imageContainer}>
          <Image
            source={{ uri: product.images.main }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        </View>
        <View style={style.detailsContainer}>
          <View
            style={{
              marginLeft: 20,
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <View style={style.line} />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {product.brand}
            </Text>
          </View>
          <View
            style={{
              marginLeft: 20,
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>
              {product.name}
            </Text>
            <View style={style.priceTag}>
              <Text
                style={{
                  marginLeft: 15,
                  color: COLORS.white,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                ${product.price}
              </Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>About</Text>
            <Text
              style={{
                color: "grey",
                fontSize: 16,
                lineHeight: 22,
                marginTop: 10,
              }}
            >
              {product.description}
            </Text>
            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={style.counter}>
                <TouchableOpacity
                  disabled={value <= 1}
                  onPress={() => {
                    setValue(Math.max(value - 1, 0));
                  }}
                  style={style.counterAction}
                >
                  <Text style={style.counterActionText}>-</Text>
                </TouchableOpacity>
                <Text style={style.counterValue}>{value}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setValue(value + 1);
                  }}
                  style={style.counterAction}
                >
                  <Text style={style.counterActionText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleConnect} style={style.buyBtn}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Connect
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const style = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  imageContainer: {
    flex: 0.45,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 0.55,
    backgroundColor: COLORS.light,
    marginHorizontal: 7,
    marginBottom: 7,
    borderRadius: 20,
    marginTop: 30,
    paddingTop: 30,
  },
  line: {
    width: 25,
    height: 2,
    backgroundColor: COLORS.dark,
    marginBottom: 5,
    marginRight: 3,
  },
  buyBtn: {
    width: 130,
    height: 40,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  priceTag: {
    backgroundColor: COLORS.green,
    width: 80,
    height: 40,
    justifyContent: "center",
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    borderStyle: "solid",
    borderRadius: 8,
    height: 36,
  },
  counterAction: {
    width: 46,
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  counterActionText: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "500",
    color: "#000",
  },
  counterValue: {
    minWidth: 34,
    fontSize: 14,
    fontWeight: "500",
    color: "#101010",
    textAlign: "center",
    paddingHorizontal: 8,
  },
});

export default Details;
