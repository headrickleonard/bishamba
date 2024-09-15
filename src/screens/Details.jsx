import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Pressable
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../const/colors";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { sendNotification } from "../api";
import { useAuth } from "../contexts/AuthContext";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { formatTZSCurrency } from "../utils/index";
import Accordion from "../components/accordion/Accordion";
import Animated, {
  FadeInLeft,
  FadeOutUp,
  FadeOutLeft,
  FadeInDown,
} from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_LOCATION = {
  coords: {
    latitude: -8.9175,
    longitude: 33.4629
  }
};

const Details = ({ navigation, route }) => {
  const { accessToken, logout } = useAuth();
  const { product  } = route.params || {};
  const [value, setValue] = useState(1);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const getLocation = useCallback(async (retryCount = 0) => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission not granted");
        return DEFAULT_LOCATION;
      }

      const lastKnownLocation = await AsyncStorage.getItem('lastKnownLocation');
      if (lastKnownLocation) {
        return JSON.parse(lastKnownLocation);
      }

      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Location request timed out')), 10000)
      );

      const newLocation = await Promise.race([locationPromise, timeoutPromise]);
      
      if (newLocation) {
        await AsyncStorage.setItem('lastKnownLocation', JSON.stringify(newLocation));
        return newLocation;
      }
    } catch (error) {
      console.error("Error getting location:", error);
      if (retryCount < 2) {
        console.log(`Retrying... Attempt ${retryCount + 1}`);
        return getLocation(retryCount + 1);
      } else {
        console.log("All location attempts failed. Using default location.");
        return DEFAULT_LOCATION;
      }
    }
  }, []);

  useEffect(() => {
    getLocation().then(newLocation => setLocation(newLocation));
  }, [getLocation]);

  const handleConnect = async () => {
    if (accessToken) {
      await sendNotificationToShopOwner();
    } else {
      navigation.navigate("Auth", { returnScreen: "Details" });
    }
  };

  const sendNotificationToShopOwner = async () => {
    setIsLoading(true);
    let currentLocation = location || DEFAULT_LOCATION;

    const notificationData = {
      shopId: product?.shopId,
      productId: product?.id,
      quantity: value,
      totalPrice: product?.price * value,
      userLocation: `Latitude: ${currentLocation.coords.latitude}, Longitude: ${currentLocation.coords.longitude}`,
      notificationChannel: "SMS",
      notificationType: "EXTERNAL",
      // imageUrl: product?.images?.[0],
      // shopName: product?.shopName,
    };

    try {
      setStatus(null);
      const response = await sendNotification(notificationData, accessToken);
      Toast.show({
        type: "success",
        text1: "Notification sent successfully.",
        text2: `You are ordering: ${value} ${product?.name}`,
        text2Style: { fontWeight: "bold", marginVertical: 4, fontSize: 12 },
        visibilityTime: 5000,
      });
      navigation.goBack();
      console.log("Notification sent successfully:", response);
    } catch (error) {
      console.error("Error sending notification:", error.response.data.data);
      Toast.show({
        type: "error",
        text1: error.response.data.data,
        text2: "Please try again. If the issue persists, visit our help center.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
          {/* <View style={styles.header}>
            <Pressable style={styles.backButton}>
              <Icon
                name="arrow-back"
                size={24}
                onPress={() => navigation.goBack()}
              />
            </Pressable>
          </View> */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product?.images?.[0] }}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.shopDetails}>
              <View style={styles.badgeContainer}>
                <Icon name="location-on" size={18} color={COLORS.yellow} />
                <Text style={styles.badgeText}>{product?.shopName}</Text>
              </View>
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>
                  {formatTZSCurrency(product?.price)}
                </Text>
              </View>
            </View>
            <View style={styles.productNameContainer}>
              <Text style={styles.productName}>{product?.name}</Text>
            </View>
            <View style={styles.aboutContainer}>
              {/* <Text style={styles.aboutTitle}>About</Text> */}
              <Accordion description={product?.description} />
            </View>
            <View style={styles.quantityContainer}>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => {
                    if (value > 1) setValue(value - 1);
                  }}
                  style={styles.borderBtn}
                >
                  <Text style={styles.borderBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{value}</Text>
                <TouchableOpacity
                  onPress={() => setValue(value + 1)}
                  style={styles.borderBtn}
                >
                  <Text style={styles.borderBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              {/* <TouchableOpacity onPress={handleConnect} style={styles.buyBtn}>
                <Text style={styles.buyBtnText}>Connect</Text>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={handleConnect} style={styles.buyBtn}>
                <Animated.View entering={FadeInLeft} exiting={FadeOutUp}>
                  {isLoading && (
                    <Animated.View exiting={FadeOutLeft} entering={FadeInDown}>
                      <ActivityIndicator size={12} color={COLORS.light} />
                    </Animated.View>
                  )}
                  {status === "success" && (
                    <Animated.View exiting={FadeOutLeft} entering={FadeInDown}>
                      <Icon
                        name="check-circle"
                        size={24}
                        color={COLORS.green}
                      />
                    </Animated.View>
                  )}
                  {status === "error" && (
                    <Animated.View exiting={FadeOutLeft} entering={FadeInDown}>
                      <Icon name="error" size={24} color={COLORS.red} />
                    </Animated.View>
                  )}
                </Animated.View>
                <Text style={styles.buyBtnText} disabled={isLoading}>
                  Connect
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    borderRadius: 50,
    padding: 8,
  },
  imageContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  shopDetails: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.yellow,
  },
  badgeText: {
    color: COLORS.yellow,
    marginLeft: 5,
    fontSize: 12,
  },
  priceTag: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  priceText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  productNameContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  aboutContainer: {
    marginTop: 10,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  quantityContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  borderBtn: {
    borderColor: COLORS.dark,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  borderBtnText: {
    fontWeight: "bold",
    fontSize: 28,
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  buyBtn: {
    width: 120,
    height: 40,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buyBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Details;
