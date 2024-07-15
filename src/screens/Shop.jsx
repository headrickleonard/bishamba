import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getAllProductsWithShop } from "../api";
import Loader from "../components/loaders/List";

const { width } = Dimensions.get("window");
const itemWidth = width / 2 - 10; // Adjust margin and padding as needed

const Shop = ({ route,navigation }) => {
  const { shopId } = route.params;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async (shopId) => {
    try {
      const response = await getAllProductsWithShop(shopId);
      if (response && response.data && response.data.products) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products); // Initialize filtered products
      } else {
        setError("No products found");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(shopId);
  }, [shopId]);

  // Function to handle search input change
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim().length === 0) {
      // Reset to all products if search query is empty
      setFilteredProducts(products);
    } else {
      // Filter products based on search query
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  // Render product item in two-column grid
  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productCard}
    onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}

    >
      <Image source={{ uri: item.images.main }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {loading ? (
        <Loader />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredProducts.length === 0 ? (
        <Text style={styles.errorText}>No products found.</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          contentContainerStyle={styles.contentContainer}
          numColumns={2} // Two-column layout
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: itemWidth,
    marginHorizontal: 4,
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Shop;
