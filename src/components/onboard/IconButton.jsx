// IconButton.js
import React from "react";
import {
  Pressable,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const ICON_LIBRARIES = {
  Feather: () => Feather,
  MaterialCommunityIcons: () => MaterialCommunityIcons,
};

const IconButton = ({
  icon,
  iconFamily = "Feather",
  variant = "contained",
  size = "medium",
  iconColor = "white",
  roundness = "medium",
  style = {},
  onPress,
}) => {
  const Icon = ICON_LIBRARIES[iconFamily]();
  const iconSize = size === "big" ? 24 : size === "medium" ? 16 : 12;
  const buttonSize = size === "big" ? 48 : size === "medium" ? 36 : 24;

  const buttonStyles = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${roundness}Roundness`],
    { width: buttonSize, height: buttonSize },
    style,
  ];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        buttonStyles,
        pressed && styles.buttonPressed,
        pressed && styles.shadow,
      ]}
    >
      <Icon name={icon} size={iconSize} color={iconColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  containedButton: {
    backgroundColor: "#2196F3",
  },
  textButton: {
    backgroundColor: "transparent",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  fullRoundness: {
    borderRadius: 100,
  },
  mediumRoundness: {
    borderRadius: 20,
  },
  smallRoundness: {
    borderRadius: 10,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
});

export default IconButton;
