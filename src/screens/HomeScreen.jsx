import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getAllProducts, viewAllCategories } from "../api";
import HomeLoader from "../components/loaders/HomeLoader";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import COLORS from "../const/colors";
import { PRIMARY_COLOR } from "../styles/styles";
import { formatTZSCurrency } from "../utils";
const width = Dimensions.get("window").width / 2 - 30;

const HomeScreen = ({ navigation }) => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await viewAllCategories();
      if (response && response.status === "success" && response.data) {
        const categoryNames = [
          "All",
          ...response.data.map((item) => item.categoryName),
        ];
        setCategories(categoryNames);
        console.log("The categories list has:", categoryNames);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Error fetching categories");
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response && response.status === "success" && response.data) {
        setProducts(response.data);
        setFilteredProducts(response.data); // Set initial filtered products to all products
        console.log("The products list has:", response.data);
      } else {
        setError("Failed to fetch products");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error fetching products");
      setLoading(false); // Set loading to false in case of error
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    await fetchAllProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, categoryIndex]);

  const filterProducts = () => {
    let filtered = products; // Start with all products

    if (categoryIndex > 0) {
      // Check if a specific category is selected (index > 0)
      const selectedCategory = categories[categoryIndex]; // Get the selected category name
      filtered = products.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchQuery) {
      // Apply search query filtering if there is a search query
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered); // Update state with filtered products
  };

  const CategoryList = () => {
    return (
      <View style={style.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories?.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setCategoryIndex(index)}
            >
              <Text
                style={[
                  style.categoryText,
                  categoryIndex === index && style.categoryTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const Card = ({ product }) => {
    const [imageSource, setImageSource] = useState({
      uri: product?.images[0] || "https://example.com/default-image.png",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showFullName, setShowFullName] = useState(false);
    const [rating, setRating] = useState(0); // Add state for rating

    useEffect(() => {
      if (imageSource.uri === product?.images[0]) {
        setLoading(true);
        setError(false);
      }
    }, [imageSource, product?.images]);

    const handleLoadEnd = () => {
      setLoading(false);
    };

    const handleError = () => {
      setLoading(false);
      setError(true);
      setImageSource({
        uri: "https://cdn-icons-png.flaticon.com/128/10446/10446694.png",
      });
    };

    useEffect(() => {
      return () => {
        console.log("the image is :", product.images[0]);
      };
    }, []);

    const toggleShowFullName = () => {
      setShowFullName(!showFullName);
    };

    const renderProductName = () => {
      if (product?.name.length > 10) {
        if (showFullName) {
          return product?.name;
        } else {
          return `${product?.name.substring(0, 12)}...`;
        }
      }
      return product?.name;
    };
    const handleRatingPress = (rate) => {
      setRating(rate); // Update the rating state with the clicked star
    };
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Details", { product })}
      >
        <View style={style.card}>
          <View style={{ alignItems: "flex-end" }}>
            {/* <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: product?.isInStock
                  ? "rgba(245, 42, 42,0.2)"
                  : "rgba(0,0,0,0.2)",
              }}
            >
              <Icon
                name="favorite"
                size={18}
                color={product?.isInStock ? COLORS.red : COLORS.black}
              />
            </View> */}
          </View>

          {loading && (
            <ActivityIndicator
              style={style.activityIndicator}
              size="large"
              color={COLORS.primary}
            />
          )}
          <Image
            source={imageSource}
            style={style.image}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
          />

          <TouchableOpacity onPress={toggleShowFullName}>
            <Text style={style.productName}>{renderProductName()}</Text>
          </TouchableOpacity>
          <Text style={style.price}>{formatTZSCurrency(product?.price)}</Text>
          <Text style={style.stockStatus}>
            {product?.isInStock ? "In Stock" : "Out of Stock"}
          </Text>
          <View style={style.rating}>
            <Icon name="star" size={16} color={COLORS.yellow} />
            <Icon name="star" size={16} color={COLORS.yellow} />
            <Icon name="star" size={16} color={COLORS.yellow} />
            <Text style={style.ratingText}>{product?.rating}</Text>
          </View>
          {/* <View style={style.rating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingPress(star)}
              >
                <Icon
                  name={star <= rating ? "star" : "star-outline"}
                  size={24}
                  color={star <= rating ? COLORS.yellow : COLORS.dark}
                  // color={COLORS.yellow}
                />
              </TouchableOpacity>
            ))}
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: COLORS.white,
        }}
      >
        <View style={style.header}>
          <View>
            <Text
              style={{ fontSize: 36, color: COLORS.green, fontWeight: "bold" }}
            >
              Bishamba
            </Text>
          </View>
          <Pressable onPress={() => navigation.navigate("Notifications")}>
            <Icon name="notifications" size={28} color={"gray"} />
          </Pressable>
        </View>
        <View style={{ marginTop: 30, flexDirection: "row" }}>
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={20}
              color="gray"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search agro-vet shops"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity activeOpacity={0.8} style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
          <Pressable
            style={style.sortBtn}
            onPress={() => {
              navigation.navigate("ShopsList");
            }}
          >
            <Icon name="apps" size={30} color={COLORS.white} />
          </Pressable>
        </View>
        <CategoryList />
        {loading ? (
          <HomeLoader />
        ) : (
          <FlatList
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: 10,
              paddingBottom: 50,
            }}
            numColumns={2}
            data={filteredProducts}
            renderItem={({ item }) => {
              return <Card product={item} />;
            }}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const style = StyleSheet.create({
  categoryContainer: {
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  categoryText: {
    fontSize: 16,
    color: "grey",
    fontWeight: "bold",
    marginHorizontal: 12,
    textTransform: "uppercase",
  },
  categoryTextSelected: {
    color: COLORS.green,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: COLORS.green,
  },
  card: {
    height: 225,
    backgroundColor: COLORS.light,
    width,
    marginHorizontal: 2,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  header: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    borderRadius: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    color: COLORS.dark,
  },
  sortBtn: {
    marginLeft: 10,
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
  },
  // cards
  container: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    flex: 1,
  },
  activityIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: 100 }, { translateY: -50 }],
  },
  stockStatus: {
    fontSize: 12,
    color: COLORS.grey,
    marginTop: 5,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: COLORS.grey,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 10,
  },
  price: {
    fontSize: 19,
    fontWeight: "bold",
    color: COLORS.green,
    marginTop: 5,
  },
});

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "85%",
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
});

export default HomeScreen;
