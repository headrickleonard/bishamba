// components/ScreenWrapper.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const ScreenWrapper = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50, // Adjust this value as needed for your bottom padding
   // paddingHorizontal: 10, // Optional: add horizontal padding if needed
   backgroundColor:"white",
  },
});

export default ScreenWrapper;
