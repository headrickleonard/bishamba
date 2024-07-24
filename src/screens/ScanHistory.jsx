import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getSearchHistory, insertSearchTerm } from "../db/database";
import HistoryFilterChip from "../components/HistoryFilterChip";
import { Divider } from "react-native-paper";
import { sendPredictionIds } from "../api/index";
import { getPlantIds } from "../utils";

export default function App() {
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showSearchButton, setShowSearchButton] = useState(true);
  const [diseasePredictions, setDiseasePredictions] = useState([]);

  const searchTimeout = useRef(null);
  const timeoutRef = useRef(null);

  const fetchSearchHistory = () => {
    getSearchHistory((history) => {
      setSearchHistory(history.map((item) => item.term));
    });
  };

  const fetchPlantIds = async () => {
    try {
      const ids = await getPlantIds();
      const response = sendPredictionIds(ids);
      setDiseasePredictions(response.data.data);
      console.log("the ids are:", ids);
    } catch (error) {
      console.error(
        "Error fetching plant IDs or sending prediction IDs:",
        error
      );
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() !== "" && !searchHistory.includes(text)) {
      insertSearchTerm(text);
      setSearchHistory([text, ...searchHistory]);
    }
  };

  const handleInputChange = (text) => {
    setSearch(text);
    setShowSearchButton(false);
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setShowSearchButton(true);
    }, 2000);
  };

  const handleClearSearch = () => {
    setSearch("");
    setShowSearchButton(true);
  };

  useEffect(() => {
    fetchSearchHistory();
    fetchPlantIds();
  }, []);

  const renderDiseaseCards = (diseases) => {
    return diseases.map((disease, index) => (
      <View key={index} style={styles.card}>
        <Image source={{ uri: disease.imageUri }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{disease.predictionId}</Text>
          <Text style={styles.description}>{disease.symptoms}</Text>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Icon
            name="ios-search"
            size={20}
            color="#555"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChangeText={handleInputChange}
          />
          {showSearchButton ? (
            <TouchableOpacity
              onPress={fetchPlantIds}
              // onPress={() => handleSearch(search)}
              style={styles.searchButton}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Icon name="ios-close" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-xl font-semibold mb-4">Recent searches:</Text>
        {searchHistory.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.historyScrollView}
          >
            <HistoryFilterChip
              data={searchHistory}
              selectedChip={selectedFilter}
              onSelectChip={(term) => {
                setSearch(term);
                setSelectedFilter(term);
              }}
            />
          </ScrollView>
        ) : (
          <Text className="text-lg font-semibold text-center">
            No search history
          </Text>
        )}

        <Divider />

        {diseasePredictions.length > 0 ? (
          renderDiseaseCards(diseasePredictions)
        ) : (
          <Text style={styles.noResultsText} className="font-semibold text-xl">
            No results found for
            <Text className="font-bold text-black"> "{search}"</Text>
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
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
  historyScrollView: {
    paddingBottom: 10,
  },
});
