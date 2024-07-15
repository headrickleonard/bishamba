import { BlurView } from "expo-blur";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PRIMARY_COLOR } from "../styles/styles";

const CustomHeader = ({ navigation }) => (
  <BlurView intensity={50} style={styles.headerBackground}>
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backButton}
    >
      <Ionicons name="arrow-back" color="white" size={24} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Plant Details</Text>
  </BlurView>
);

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    // marginHorizontal: 4,
    // marginTop: 40,
    borderRadius: 20,
    overflow: "hidden",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 32,
  },
  headerTitle: {
    color: PRIMARY_COLOR,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default CustomHeader;
