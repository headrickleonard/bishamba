import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const OTPInput = ({ onOTPChange }) => {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const inputs = Array(6).fill(0);
  const otpTextInputRefs = inputs.map((_, i) => useRef(null));

  const handleInputChange = (index, value) => {
    // Ensure value is a single digit (0-9) or an empty string (for delete)
    if (value.length <= 1) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
      onOTPChange(newOTP);

      // If deleting and current input is empty, focus on previous input
      if (value === "" && index > 0) {
        otpTextInputRefs[index - 1].current.focus();
      }

      // If typing and current input is not the last one, focus on next input
      if (value !== "" && index < 5) {
        otpTextInputRefs[index + 1].current.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      {inputs.map((_, index) => (
        <TextInput
          key={index}
          style={styles.input}
          maxLength={1}
          keyboardType="numeric"
          onChangeText={(value) => handleInputChange(index, value)}
          value={otp[index]}
          ref={otpTextInputRefs[index]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  input: {
    borderWidth: 0.5,
    borderColor: "#000",
    fontSize: 24,
    width: "14%",
    height: 36,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
    borderRadius: 8,
  },
});

export default OTPInput;