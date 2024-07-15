import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";

const width = Dimensions.get("window").width / 2 - 30;

const HomeLoader = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <View key={index} style={styles.card}>
          <ContentLoader
            speed={2}
            width={width}
            height={225}
            viewBox={`0 0 ${width} 225`}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{ width: width, height: 225, borderRadius: 10 }}
          >
            {/* Placeholder for the product image */}
            <Rect
              x="15"
              y="15"
              rx="10"
              ry="10"
              width={width - 30}
              height={140}
            />

            {/* Placeholder for the product name */}
            <Rect x="15" y="165" rx="5" ry="5" width={width - 30} height={20} />

            {/* Placeholder for the product price */}
            <Rect x="15" y="195" rx="5" ry="5" width={width - 30} height={20} />
          </ContentLoader>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  card: {
    marginBottom: 20,
    width: width,
  },
});

export default HomeLoader;
