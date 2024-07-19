import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth hook
import { registerNewUser, validateOTP } from "../api/index";

export default function Auth({ navigation, route }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    code: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const { login } = useAuth();

  const validatePhoneNumber = (phoneNumber) => {
    const cleanedNumber = phoneNumber.replace(/\D/g, "");

    if (/^0\d{9}$/.test(cleanedNumber)) {
      return `+255${cleanedNumber.substring(1)}`;
    }

    if (/^\+255\d{9}$/.test(cleanedNumber)) {
      return cleanedNumber;
    }

    return null;
  };

  const handleSignUp = async () => {
    if (!form.email || !form.password || !form.phoneNumber) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const formattedPhoneNumber = validatePhoneNumber(form.phoneNumber);
    if (!formattedPhoneNumber) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    try {
      setIsLoading(true);
      const { email, password, phoneNumber } = form;
      const userData = { email, password, phoneNumber };
      // const userData = { email, password, phoneNumber: formattedPhoneNumber };

      // await registerNewUser(userData);
      const response = await registerNewUser(userData);
      Alert.alert(
        "Success",
        "Registration successful. Please check your SMS for the OTP."
      );
      setIsOTPSent(true);
    } catch (error) {
      Alert.alert("Error", "User with similar password already exist");
      console.error("Registration Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleVerifyOTP = async () => {
  //   if (!form.code) {
  //     Alert.alert("Error", "Please enter the OTP");
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     const { phoneNumber, code } = form;
  //     const response = await validateOTP(phoneNumber, code);
  //     // Assuming response contains the access token
  //     const { accessToken } = response;
  //     await login(accessToken); // Store the access token using login function
  //     Alert.alert("Success", "OTP verified successfully.");
  //     navigation.navigate(route.params.returnScreen);
  //   } catch (error) {
  //     Alert.alert("Error", "OTP verification failed. Please try again.");
  //     console.error("OTP Verification Error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleVerifyOTP = async () => {
    if (!form.code) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    try {
      setIsLoading(true);
      const { phoneNumber, code } = form;
      const response = await validateOTP(phoneNumber, code);


      if (response.status==="success") {
        const { accessToken } = response.data;
        console.log("the response is...", response.data);
        await login(accessToken); // Store the access token using login function
        Alert.alert("Success", "OTP verified successfully.");
        navigation.goBack();
      } else {
        throw new Error(response.message || "Invalid response format");
      }
    } catch (error) {
      Alert.alert("Error", "OTP verification failed. Please try again.");
      console.error("OTP Verification Error:", error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderPhoneNumberInput = () => {
    if (isOTPSent) {
      return (
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            editable={false}
            placeholder={form.phoneNumber}
            style={styles.inputControl}
            value={form.phoneNumber}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerAction}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack(); // Handle go back navigation
              }}
            >
              <FeatherIcon color="#000" name="x" size={24} />
            </TouchableOpacity>
          </View>

          <Text numberOfLines={1} style={styles.headerTitle}>
            {isOTPSent ? "Verify OTP" : "Create an Account"}
          </Text>

          <View style={[styles.headerAction, { alignItems: "flex-end" }]}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
            >
              <FeatherIcon color="#000" name="info" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAwareScrollView>
          <View style={styles.form}>
            {!isOTPSent ? (
              <>
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Enter your email</Text>

                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    keyboardType="email-address"
                    onChangeText={(email) => setForm({ ...form, email })}
                    placeholder="Email address"
                    placeholderTextColor="#878E9A"
                    style={styles.inputControl}
                    value={form.email}
                  />
                </View>

                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Enter your password</Text>

                  <View style={[styles.inputControl, { flexDirection: "row" }]}>
                    <TextInput
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      onChangeText={(password) =>
                        setForm({ ...form, password })
                      }
                      placeholder="********"
                      placeholderTextColor="#878E9A"
                      style={{ flex: 1 }}
                      secureTextEntry={!showPassword}
                      value={form.password}
                    />
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPress={togglePasswordVisibility}
                    >
                      <FeatherIcon
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#878E9A"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Enter your phone number</Text>

                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={(phoneNumber) =>
                      setForm({ ...form, phoneNumber })
                    }
                    placeholder="Phone number (+255123456789)"
                    placeholderTextColor="#878E9A"
                    style={styles.inputControl}
                    keyboardType="phone-pad"
                    value={form.phoneNumber}
                  />
                </View>

                <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
                  <View style={styles.btn}>
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.btnText}>Sign Up</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <View>
                {renderPhoneNumberInput()}
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Enter OTP</Text>

                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={(code) => setForm({ ...form, code })}
                    placeholder="Enter OTP"
                    placeholderTextColor="#878E9A"
                    style={styles.inputControl}
                    keyboardType="number-pad"
                    value={form.code}
                  />

                  <TouchableOpacity
                    onPress={handleVerifyOTP}
                    disabled={isLoading}
                  >
                    <View style={styles.btn}>
                      {isLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.btnText}>Verify OTP</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  form: {
    paddingHorizontal: 24,
  },
  /** Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "600",
    color: "#292929",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: "center",
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#292929",
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: "#f0f4f6",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderColor: "#d7dbdd",
    borderWidth: 1,
  },
  toggleButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    marginRight: 8,
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#292B32",
    borderColor: "#292B32",
    marginTop: 16,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.133,
  },
});
