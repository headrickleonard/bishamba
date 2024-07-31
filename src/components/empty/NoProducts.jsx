import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTranslation } from "react-i18next";

const NoProducts = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/anime/loader1.json')} 
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.text}>{t("noProducts")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
});

export default NoProducts;
