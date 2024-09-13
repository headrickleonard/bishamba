import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
} from "react-native";
import { sendPredictionIds } from "../api/index";
import { getPlantIds } from "../utils";

const ScanHistory = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [diseasePredictions, setDiseasePredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchScanHistory = useCallback(async () => {
    setLoading(true);
    try {
      const ids = await getPlantIds();
      console.log("Fetched plant IDs:", ids);
      if (ids.length === 0) {
        console.log("No scan history found");
        setDiseasePredictions([]);
        return;
      }
      const response = await sendPredictionIds(ids);
      console.log("API response:", response);
      if (response && Array.isArray(response) && response[0]?.data) {
        if (response[0].data.length === 0) {
          console.log("API returned empty data array");
          Alert.alert("No History", "You haven't scanned any plants yet.");
        } else {
          setDiseasePredictions(response[0].data);
        }
      } else {
        console.error("Unexpected response format:", response);
        Alert.alert("Error", "Failed to fetch scan history. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching scan history:", error);
      Alert.alert("Error", "Failed to fetch scan history. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScanHistory();
  }, [fetchScanHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchScanHistory();
    setRefreshing(false);
  }, [fetchScanHistory]);

  const handleSearch = () => {
    // Implement search functionality here
    console.log("Searching for:", search);
  };

  const DiseaseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DiseaseDetails', { disease: item })}
    >
      <Image
        style={styles.image}
        source={{ uri: item.analyzedImage }}
        defaultSource={require('../assets/images/plant1.png')} // Add a placeholder image
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.commonName}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.comment}</Text>
        <Text style={styles.confidence}>Confidence: {item.confidence}%</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="green" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {/* {!loading && diseasePredictions.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="leaf-outline" size={64} color="gray" />
          <Text style={styles.emptyStateText}>No scan history found</Text>
          <Text style={styles.emptyStateSubtext}>Start scanning plants to build your history!</Text>
        </View>
      )} */}

      <FlatList
        data={diseasePredictions}
        renderItem={({ item }) => <DiseaseCard item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="leaf-outline" size={64} color="gray" />
              <Text style={styles.emptyStateText}>No results found</Text>
              <Text style={styles.emptyStateSubtext}>Try adjusting your search or scan more plants</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

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
  loadingText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ScanHistory;
