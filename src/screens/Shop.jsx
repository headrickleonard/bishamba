import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getAllProductsWithShop } from "../api";
import Loader from "../components/loaders/List";
import { formatTZSCurrency } from "../utils";
import ScreenWrapper from "../components/shared/ScreenWrapper";

const { width } = Dimensions.get("window");
const itemWidth = width / 2 - 20; // Adjust margin and padding as needed

const Shop = ({ route, navigation }) => {
  const { shopId } = route.params;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProductIds, setExpandedProductIds] = useState([]);

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

  const toggleDescription = (productId) => {
    setExpandedProductIds((prevState) =>
      prevState.includes(productId)
        ? prevState.filter((id) => id !== productId)
        : [...prevState, productId]
    );
  };

  // Render product item in two-column grid
  const renderProductItem = ({ item }) => {
    // Early return if item is null or undefined
    if (!item) {
      return null;
    }
  
    const isExpanded = expandedProductIds.includes(item.id);
    const description = item.description
      ? item.description.length > 30 && !isExpanded
        ? `${item.description.slice(0, 30)}...`
        : item.description
      : 'No description available';
  
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.productCard}
        onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
      >
        <Image 
          source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150' }} 
          style={styles.productImage} 
        />
        <Text style={styles.productName}>{item.name || 'Unnamed Product'}</Text>
        <Text style={styles.productPrice}>{formatTZSCurrency(item.price || 0)}</Text>
        {/* <Text
          style={styles.productDescription}
          onPress={() => toggleDescription(item.id)}
        >
          {description}
        </Text> */}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search products in this shop...`}
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
        data={filteredProducts.filter(product => product !== null && product !== undefined)}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.contentContainer}
        numColumns={2}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>No products found.</Text>
        )}
      />
      )}
    </SafeAreaView>
    </ScreenWrapper>
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
    marginBottom: 20,
    width: itemWidth,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: "#555",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default Shop;
