import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { View, StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const renderLoader = (key) => (
  <ContentLoader
    key={key}
    speed={2}
    width={screenWidth - 36} // Adjust width to be responsive
    height={screenHeight / 3} // Adjust height to be responsive
    viewBox={`0 0 ${screenWidth - 24} ${screenHeight / 3}`}
    backgroundColor="#cccdcf"
    foregroundColor="#dedede"
  >
    <Rect x="12" y="35" rx="0" ry="0" width="6" height={screenHeight / 3 - 70} />
    <Rect x="14" y="34" rx="0" ry="0" width={screenWidth - 48} height="6" />
    <Rect x={screenWidth - 30} y="34" rx="0" ry="0" width="6" height={screenHeight / 3 - 70} />
    <Rect x="12" y={screenHeight / 3 - 24} rx="0" ry="0" width={screenWidth - 24} height="6" />
    <Rect x={(screenWidth - 24) / 2 - 63.5} y="53" rx="6" ry="6" width="127" height="15" />
    <Rect x="37" y="77" rx="7" ry="7" width={screenWidth - 74} height={screenHeight / 3 - 161} />
    <Rect x="58" y={screenHeight / 3 - 75} rx="0" ry="0" width={screenWidth - 116} height="8" />
    <Rect x="86" y={screenHeight / 3 - 62} rx="0" ry="0" width={screenWidth - 172} height="8" />
    <Rect x="58" y={screenHeight / 3 - 48} rx="0" ry="0" width={screenWidth - 116} height="8" />
  </ContentLoader>
);

const PostsLoader = () => {
  const loaders = Array.from({ length: 3 }, (_, index) => renderLoader(index));

  return <View style={styles.container}>{loaders}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PostsLoader;
