import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { sendPredictionIds } from "../api/index";
import { getPlantIds } from "../utils";

const ScanHistory = () => {
  const [search, setSearch] = useState("");
  const [diseasePredictions, setDiseasePredictions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchButton, setShowSearchButton] = useState(true);

  const fetchPlantIds = async () => {
    const predictionsIds = [
      "e78b722e-4e0e-4368-9ea2-7bdc9be2b87a",
      "84486222-82b6-496b-8369-f9fcf7390c00",
      "f3697f1a-761b-4b45-9196-c4077661e069",
    ];
    try {
      const ids = await getPlantIds();
      console.log("The ids are:", ids);
      const response = await sendPredictionIds(predictionsIds);
      // const response = await sendPredictionIds(ids);
      console.log("Response data:", response[0].data);
      if (response && Array.isArray(response)) {
        setDiseasePredictions(response[0].data);
        console.log("the diseasePredictions array has:", diseasePredictions);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error(
        "Error fetching plant IDs or sending prediction IDs:",
        error
      );
    }
  };

  useEffect(() => {
    fetchPlantIds();
  }, []);

  const handleInputChange = (text) => {
    setSearch(text);
    setShowSearchButton(false);
    setTimeout(() => {
      setShowSearchButton(true);
    }, 2000);
  };

  const handleClearSearch = () => {
    setSearch("");
    setShowSearchButton(true);
  };

  const DiseaseCard = ({ SampleDisease }) => {
    return (
      <View className="w-full h-20 p-2 bg-slate-200 rounded-xl flex flex-row items-center justify-evenly mb-2">
        <Image
          className="h-12 w-12 rounded-full border border-slate-500"
          source={{
            uri: SampleDisease?.analyzedImage,
          }}
        />
        <View className="flex flex-col items-start justify-start ml-2">
          <Text className="font-semibold text-lg">
            {SampleDisease?.commonName}
          </Text>
          <Text className="font-light">{SampleDisease?.comment}</Text>
        </View>
        <Ionicons name="chevron-forward-circle-sharp" size={24} color="green" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChangeText={handleInputChange}
          />
          {showSearchButton ? (
            <TouchableOpacity
              onPress={fetchPlantIds}
              style={styles.searchButton}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* {diseasePredictions.length > 0 ? (
          renderDiseaseCards(diseasePredictions)
        ) : (
          <Text style={styles.noResultsText}>No results found</Text>
        )} */}

        {diseasePredictions.map((disease) => (
          <DiseaseCard SampleDisease={disease} />
        ))}
        <DiseaseCard />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScanHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 64,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 20,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  confidence: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  searchButtonText: {
    color: "#000",
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#dedede",
    borderRadius: 8,
    padding: 6,
  },
  clearButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 6,
  },
  clearButtonText: {
    color: "#000",
    fontSize: 16,
  },
});
