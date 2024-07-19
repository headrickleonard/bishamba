import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import ScreenWrapper from "../shared/ScreenWrapper";

const { width, height } = Dimensions.get("window");

const loaderHeight = height / 2 - 16;

const GenericPostLoader = (props) => {
  return (
    <ContentLoader
      speed={2}
      width={width - 32} // Adjust the width to be the screen width minus some padding
      height={loaderHeight}
      viewBox={`0 0 ${width - 32} ${loaderHeight}`} // Adjust the viewBox to match the width and loaderHeight
      backgroundColor="#cfe8f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <Rect x="48" y="5" rx="3" ry="3" width={width * 0.3} height="8" />
      <Rect x="48" y="28" rx="3" ry="3" width={width * 0.85} height="6" />
      <Rect x="48" y="48" rx="3" ry="3" width={width * 0.8} height="6" />
      <Rect x="48" y="68" rx="3" ry="3" width={width * 0.4} height="6" />
      <Circle cx="20" cy="20" r="20" />
      <Rect x="0" y="98" rx="24" ry="24" width={width - 32} height="230" />
    </ContentLoader>
  );
};

const LoaderWrapper = () => {
  return (
    <View style={styles.container}>
      <ScreenWrapper>
        <GenericPostLoader />
        <GenericPostLoader />
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around", // Ensure the loaders are spaced evenly
    padding: 16,
  },
});

export default LoaderWrapper;
