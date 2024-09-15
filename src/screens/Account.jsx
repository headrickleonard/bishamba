import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Platform,
  NativeModules,
  Modal,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Linking,
  Alert
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../translations/i18n"; // Adjust the path if necessary
import ScreenWrapper from "../components/shared/ScreenWrapper";
import * as StoreReview from "expo-store-review";
import * as Location from 'expo-location';

import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const languages = [
  { id: "en", name: "English", country: "US" },
  { id: "es", name: "Spanish", country: "ES" },
  { id: "fr", name: "French", country: "FR" },
  { id: "de", name: "German", country: "DE" },
  { id: "it", name: "Italian", country: "IT" },
  { id: "pt", name: "Portuguese", country: "PT" },
  { id: "zh", name: "Chinese", country: "CN" },
  { id: "sw", name: "Swahili", country: "TZ" },
  { id: "hi", name: "Hindi", country: "IN" },
  { id: "ar", name: "Arabic", country: "EG" },

  // Add more languages as needed
];

const getDefaultLanguage = async () => {
  const storedLanguage = await AsyncStorage.getItem("appLanguage");
  if (storedLanguage) {
    return languages.find((lang) => lang.id === storedLanguage);
  }

  const locale =
    Platform.OS === "ios"
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;
  const localeIdentifier = locale.split("_")[0];
  const language = languages.find((lang) => lang.id === localeIdentifier);

  return language ?? languages[0];
};
const handleContactUs = () => {
  Linking.openURL("mailto:joshuasimon656@gmail.com");
};

const handleRateApp = () => {
  const appStoreURL =
    "https://play.google.com/store/apps/details?id=com.vastlabs.app&pcampaignid=web_share";
  Linking.openURL(appStoreURL);
};

const requestReview = async () => {
  try {
    const isAvailable = await StoreReview.isAvailableAsync();
    if (isAvailable) {
      await StoreReview.requestReview();
    } else {
      Alert.alert(
        "Rate App",
        "Rating feature is not available on this device."
      );
    }
  } catch (error) {
    console.error("Failed to request review:", error);
    Alert.alert("Error", "An error occurred while requesting the review.");
  }
};

export default function Account() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { userData, logout } = useAuth(); // Get userData from useAuth
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState("Loading...");

  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    language: null,
    darkMode: theme === "dark",
    emailNotifications: true,
    pushNotifications: false,
  });

  useEffect(() => {
    const fetchDefaultLanguage = async () => {
      const defaultLanguage = await getDefaultLanguage();
      setForm((form) => ({ ...form, language: defaultLanguage }));
      i18n.changeLanguage(defaultLanguage.id);
    };

    fetchDefaultLanguage();
  }, []);

  useEffect(() => {
    setForm({ darkMode: theme === "dark" });
  }, [theme]);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    setUserLocation("Updating location...");
    
    try {
      // First, try to get the last known location from storage
      const storedLocation = await AsyncStorage.getItem('lastKnownLocation');
      if (storedLocation) {
        setUserLocation(JSON.parse(storedLocation));
      }

      // Check permission status
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        status = await requestLocationPermission();
        if (status !== 'granted') {
          setUserLocation('Location permission not granted');
          return;
        }
      }

      // Try to get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000, // 15 seconds timeout
      });

      const { latitude, longitude } = location.coords;
      const address = await reverseGeocode(latitude, longitude);
      
      // Store the new location
      await AsyncStorage.setItem('lastKnownLocation', JSON.stringify(address));
      
      setUserLocation(address);
    } catch (error) {
      console.error('Error getting location:', error);
      handleLocationError(error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      return 'error';
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      let result = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (result.length > 0) {
        const { city, region, country } = result[0];
        return `${city || ''}, ${region || ''}, ${country || ''}`.replace(/^, /, '').replace(/, $/, '');
      }
      return 'Address not found';
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return 'Unable to get address';
    }
  };

  const handleLocationError = (error) => {
    if (error.code === 'E_LOCATION_SETTINGS_UNSATISFIED') {
      Alert.alert(
        'Location Services Disabled',
        'Please enable location services in your device settings.',
        [{ text: 'OK' }]
      );
      setUserLocation('Location services disabled');
    } else if (error.code === 'E_TIMEOUT') {
      setUserLocation('Location request timed out');
    } else {
      setUserLocation('Unable to get location');
    }
  };

  const changeLanguage = async (lang) => {
    setForm({ ...form, language: lang });
    i18n.changeLanguage(lang.id);
    await AsyncStorage.setItem("appLanguage", lang.id);
  };

  const handleLogout = async () => {
    Alert.alert(
      t("logoutConfirmation"),
      t("logoutMessage"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("logout"),
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (!form.language || !userData) {
    return null; // or a loading spinner
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.container}>
          <View style={styles.profile}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                /* handle onPress */
              }}
            >
              <View style={styles.profileAvatarWrapper}>
                <Image
                  alt=""
                  source={{
                    uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
                  }}
                  style={styles.profileAvatar}
                />

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    /* handle onPress */
                  }}
                >
                  {/* <View style={styles.profileAction}>
                    <FeatherIcon color="#fff" name="edit-3" size={15} />
                  </View> */}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            <View>
              <Text style={styles.profileName}>{userData.userName}</Text>
              <Text style={styles.profileAddress}>{userData.email}</Text>
            </View>
          </View>

          <ScrollView>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("preferences")}</Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setVisible(true)}
                style={styles.row}
              >
                <View style={[styles.rowIcon, { backgroundColor: "#fe9400" }]}>
                  <FeatherIcon color="#fff" name="globe" size={20} />
                </View>

                <Text style={styles.rowLabel}>{t("language")}</Text>
                <View style={styles.rowSpacer} />
                <Text style={styles.rowValue}>{form.language.name}</Text>
                <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>

              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: "#007afe" }]}>
                  <FeatherIcon color="#fff" name="moon" size={20} />
                </View>

                <Text style={styles.rowLabel}>{t("darkMode")}</Text>
                <View style={styles.rowSpacer} />
                {/* <Switch
                  onValueChange={(darkMode) => setForm({ ...form, darkMode })}
                  value={form.darkMode}
                /> */}
                <Switch
                  onValueChange={(darkMode) => {
                    setForm({ ...form, darkMode });
                    // toggleTheme(darkMode);
                  
                  }}
                  value={form.darkMode}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={getUserLocation}
                style={styles.row}
              >
                <View style={[styles.rowIcon, { backgroundColor: "#32c759" }]}>
                  <FeatherIcon color="#fff" name="navigation" size={20} />
                </View>

                <Text style={styles.rowLabel}>{t("location")}</Text>
                <View style={styles.rowSpacer} />
                <Text style={styles.rowValue}>{userLocation || "Tanzania"}</Text>
                <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>

              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: "#38C959" }]}>
                  <FeatherIcon color="#fff" name="at-sign" size={20} />
                </View>

                <Text style={styles.rowLabel}>{t("emailNotifications")}</Text>
                <View style={styles.rowSpacer} />
                <Switch
                  onValueChange={(emailNotifications) =>
                    setForm({ ...form, emailNotifications })
                  }
                  value={form.emailNotifications}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: "#f32e59" }]}>
                  <FeatherIcon color="#fff" name="bell" size={20} />
                </View>

                <Text style={styles.rowLabel}>{t("pushNotifications")}</Text>
                <View style={styles.rowSpacer} />
                <Switch
                  onValueChange={(pushNotifications) =>
                    setForm({ ...form, pushNotifications })
                  }
                  value={form.pushNotifications}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("help")}</Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  handleContactUs();
                }}
                style={styles.row}
              >
                <View style={[styles.rowIcon, { backgroundColor: "#007afe" }]}>
                  <FeatherIcon color="#fff" name="info" size={20} />
                </View>

                <Text style={styles.rowLabel}>{t("contactUs")}</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  handleRateApp();
                }}
                style={styles.row}
              >
                <View style={[styles.rowIcon, { backgroundColor: "#32c759" }]}>
                  {Platform.OS === "android" ? (
                    <FontAwesome color="#fff" name="google-play" size={20} />
                  ) : (
                    <FontAwesome color="#fff" name="apple" size={20} />
                  )}
                </View>

                <Text style={styles.rowLabel}>{t("rateInAppStore")}</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                  activeOpacity={0.8}
                >
                  <FeatherIcon name="log-out" size={20} color="#fff" />
                  <Text style={styles.logoutButtonText}>{t("logout")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        <Modal
          presentationStyle="pageSheet"
          animationType="slide"
          visible={visible}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setVisible(false);
            }}
            style={styles.headerClose}
          >
            <FeatherIcon color="#1d1d1d" name="x" size={24} />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Language</Text>
              {languages.map((lang, index) => {
                const { id, name, country } = lang;
                const isActive = form.language.id === id;
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={id}
                    // onPress={() => {
                    //   setForm({ ...form, language: lang });
                    //   setVisible(false);
                    // }}
                    onPress={() => {
                      changeLanguage(lang);
                      setVisible(false);
                    }}
                  >
                    <View
                      style={[
                        styles.radio,
                        index === 0 && { borderTopWidth: 0 },
                      ]}
                    >
                      <Image
                        alt={`Flag of ${country}`}
                        style={styles.radioImage}
                        source={{
                          uri: `https://flagsapi.com/${country}/flat/64.png`,
                        }}
                      />
                      <Text style={styles.radioLabel}>{name}</Text>
                      <View
                        style={[
                          styles.radioCheck,
                          isActive && styles.radioCheckActive,
                        ]}
                      >
                        <FontAwesome
                          color="#fff"
                          name="check"
                          style={!isActive && { display: "none" }}
                          size={12}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </Modal>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  headerClose: {
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  content: {
    paddingBottom: 60,
  },
  /** Profile */
  profile: {
    padding: 24,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarWrapper: {
    position: "relative",
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAction: {
    position: "absolute",
    right: -4,
    bottom: -10,
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "#007bff",
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "600",
    color: "#414d63",
    textAlign: "center",
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: "#989898",
    textAlign: "center",
  },
  /** Section */
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    paddingBottom: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#9e9e9e",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  /** Row */
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    color: "#0c0c0c",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: "500",
    color: "#9a9a9a",
  },
  /** Radio */
  radio: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  radioImage: {
    width: 30,
    height: 30,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  radioLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "#1d1d1d",
  },
  radioCheck: {
    width: 22,
    height: 22,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },
  radioCheckActive: {
    backgroundColor: "#1d1d1d",
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
    marginBottom:8
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
