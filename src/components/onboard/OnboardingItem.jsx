// OnboardingItem.js
import { Image, StyleSheet, Text, View } from "react-native";
import { SCREEN_WIDTH } from "../../utils/screen";

const OnboardingItem = ({ screen }) => {
  return (
    <View style={styles.container}>
      <Image source={screen.image} style={styles.image} />
      <Text style={styles.title}>{screen.title}</Text>
      <Text style={styles.description}>{screen.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: 350,
  },
  title: {
    color: "#ab49c1",
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    color: "#7598a5",
    width: "80%",
    textAlign: "center",
    marginVertical: 16,
  },
  header: {
    alignSelf: "flex-end",
    margin: 10,
    marginBottom: 10,
  },
});

export default OnboardingItem;
