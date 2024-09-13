import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { PRIMARY_COLOR } from "../../styles/styles";
import { getAllPlants } from "../../api";
import Loader from "../loaders/List";

export default function PlantsList({ onSelectPlant }) {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch plants when the component mounts
    const fetchPlants = async () => {
      try {
        const response = await getAllPlants();
        if (response[0].status === "success") {
          setPlants(response[0].data);
        }
        console.log("the plants are:", response[0].data);
      } catch (error) {
        console.error("Failed to fetch plants:", error);
      } finally {
        setLoading(false); // Set loading to false when fetch completes
      }
    };

    fetchPlants();
  }, []);

  if (loading) {
    return <Loader />; 
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Identify the Plant</Text>
          <Text style={styles.headerSubtitle}>
            ◯ Your choice helps us make more detailed analysis
          </Text>
        </View>
        {plants.map((plant, index) => {
          const isActive = selectedPlant === plant.id;
          return (
            <View
              key={plant.id}
              style={[
                styles.radioWrapper,
                index === 0 && { borderTopWidth: 0 },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setSelectedPlant(plant.id);
                  onSelectPlant(plant);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.radio}>
                  <View style={styles.radioIcon}>
                    <Image
                      source={{ uri: plant.icon }}
                      style={{ width: 32, height: 32 }}
                    />
                  </View>
                  <Text style={styles.radioLabel}>{plant.name}</Text>
                  <View
                    style={[
                      styles.radioCheck,
                      isActive && styles.radioCheckActive,
                    ]}
                  >
                    <FontAwesome
                      color="#fff"
                      name="check"
                      style={!isActive && { display: "none" }}
                      size={12}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  /** Header */
  header: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "gold",
    marginTop: 6,
    // borderWidth: 1,
    // borderColor: "#363638",
    borderRadius: 8,
    padding: 4,
    // borderStyle: "dashed",
    textAlign: "center",
    color:"#363638"
  },
  /** Radio */
  radio: {
    position: "relative",
    paddingRight: 24,
    paddingLeft: 0,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 12,
  },
  radioWrapper: {
    marginLeft: 24,
    borderTopWidth: 1,
    borderColor: "#e8e8e8",
  },
  radioIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  radioLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 2,
  },
  radioCheck: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  radioCheckActive: {
    backgroundColor: PRIMARY_COLOR,
  },
});
