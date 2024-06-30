import React, { useState } from "react";
import {
  StyleSheet,
  Alert,
  Keyboard,
  SafeAreaView,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    Keyboard.dismiss();

    // Replace this with the authentication API call.
    await new Promise((resolve) => setTimeout(resolve, 2000));

    reset();
    setLoading(false);

    Alert.alert(
      "Successful submission!",
      "You're logged in, navigating to the next screen! (Debug Message)"
    );
  };

  return (
    <>
      {loading && (
        <View style={styles.activityOverflow}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back!</Text>

            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email address</Text>

              <>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      keyboardType="email-address"
                      placeholder="john@example.com"
                      placeholderTextColor="#6b7280"
                      style={styles.inputControl}
                      onBlur={onBlur}
                      onChangeText={(email) => onChange(email)}
                      value={value}
                    />
                  )}
                  name="email"
                  rules={{
                    required: {
                      value: true,
                      message: "Email address is required.",
                    },

                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email address.",
                    },
                  }}
                />
                {errors.email && (
                  <Text style={styles.inputError}>{errors.email.message}</Text>
                )}
              </>
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>

              <>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      placeholder="********"
                      placeholderTextColor="#6b7280"
                      style={styles.inputControl}
                      secureTextEntry={true}
                      onBlur={onBlur}
                      onChangeText={(password) => onChange(password)}
                      value={value}
                    />
                  )}
                  name="password"
                  rules={{
                    required: {
                      value: true,
                      message: "Password is required.",
                    },
                  }}
                />
                {errors.password && (
                  <Text style={styles.inputError}>
                    {errors.password.message}
                  </Text>
                )}
              </>
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Sign in</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                // handle link
              }}
            >
              <Text style={styles.formFooter}>
                Don't have an account?{" "}
                <Text style={{ textDecorationLine: "underline" }}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  activityOverflow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    marginVertical: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1d1d1d",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },
  /** Form */
  form: {
    marginBottom: 24,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    textAlign: "center",
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  inputError: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: "red",
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#007aff",
    borderColor: "#007aff",
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
});
