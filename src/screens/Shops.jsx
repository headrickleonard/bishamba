import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import { PRIMARY_COLOR } from "../styles/styles";
import { viewAllShops } from "../api";
import Loader from "../components/loaders/List";

const Shops = () => {
  const [expandedNames, setExpandedNames] = useState({});
  const [shopsList, setShopsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (name) => {
    setExpandedNames((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const fetchShops = async () => {
    try {
      const response = await viewAllShops();
      console.log("API Response:", response); // Log the API response to inspect its structure
      const shops = response.data;
      setShopsList(Array.isArray(shops) ? shops : []); // Ensure shopsList is an array
    } catch (error) {
      console.error("Error fetching shops:", error);
      setShopsList([]); // Set shopsList to an empty array on error
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const filteredShops = shopsList.filter((shop) =>
    shop.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trimName = (name, maxLength, isExpanded) => {
    if (isExpanded) return name;
    return name.length > maxLength
      ? name.substring(0, maxLength) + "..."
      : name;
  };

  if (shopsList === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search agro-vet shops"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>All Shops</Text>
      {shopsList.length > 0 ? (
        <FlatList
          data={filteredShops}
          keyExtractor={(item) => item.shopId}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.shopContainer}
              onPress={() => toggleExpand(item.shopName)}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/300" }}
                  style={styles.profileImage}
                />
                {item.isVerified && (
                  <Octicons
                    name="verified"
                    size={20}
                    color={PRIMARY_COLOR}
                    style={styles.checkmark}
                  />
                )}
              </View>
              <Text style={styles.shop}>
                {trimName(item.shopName, 10, expandedNames[item.shopName])}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        // <Text style={styles.error}>No shops found.</Text>
        <Loader />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingTop: 36,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 36,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 24,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
  },
  shopContainer: {
    flex: 1,
    alignItems: "center",
    margin: 10,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  checkmark: {
    position: "absolute",
    bottom: 8,
    right: 2,
  },
  shop: {
    fontSize: 16,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginTop: 20,
  },
});

export default Shops;
