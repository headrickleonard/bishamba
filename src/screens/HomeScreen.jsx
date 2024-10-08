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
import NoProducts from "../components/empty/NoProducts";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

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
  const { t } = useTranslation();

  const fetchCategories = async () => {
    try {
      const response = await viewAllCategories();
      if (response && response.status === "success" && response.data) {
        const categoryNames = [
          "All",
          ...response.data.map((item) => item.categoryName),
        ];
        setCategories(categoryNames);
        // console.log("Fetched categories:", categoryNames);
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
        // console.log("Raw API response:", JSON.stringify(response.data, null, 2));
        setProducts(response.data);
        setFilteredProducts(response.data); 
      } else {
        setError("Failed to fetch products");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error fetching products");
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true)
    await fetchCategories();
    await fetchAllProducts();
    setRefreshing(false);
    setLoading(false)
  };

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, categoryIndex, products]);

  const filterProducts = () => {
    let filtered = products; // Start with all products
  
    if (categoryIndex > 0) {
      const selectedCategory = categories[categoryIndex].toLowerCase();
      // console.log("Filtering for category:", selectedCategory);
      filtered = products.filter((product) => {
        const productCategory = (product.categoryName || '').toLowerCase();
        const match = productCategory === selectedCategory;
        // console.log(`Product: ${product.name}, Category: ${product.categoryName}, Match: ${match}`);
        return match;
      });
    }
  
    if (searchQuery) {
      // console.log("Filtering for search query:", searchQuery);
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    console.log("Filtered products:", filtered.map(p => p.name));
    setFilteredProducts(filtered);
  };

  const CategoryList = () => {
    return (
      <View style={style.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories?.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => {
                console.log(`Selected category: ${item}, index: ${index}`);
                setCategoryIndex(index);
              }}
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
    // Early return if product is null or undefined
    if (!product) {
        return null; 
    }

    const [imageSource, setImageSource] = useState({
        uri: product.images?.[0] || "https://example.com/default-image.png",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showFullName, setShowFullName] = useState(false);

    useEffect(() => {
        if (imageSource.uri === product.images?.[0]) {
            setLoading(true);
            setError(false);
        }
    }, [imageSource, product.images]);

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

    const toggleShowFullName = () => {
        setShowFullName(!showFullName);
    };

    const renderProductName = () => {
        const name = product.name || 'Unnamed Product';
        if (name.length > 10) {
            return showFullName ? name : `${name.substring(0, 12)}...`;
        }
        return name;
    };
   
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Details", { product })}
        >
            <View style={style.card}>
                <View style={{ alignItems: "flex-end" }} />

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
                <Text style={style.price}>{formatTZSCurrency(product.price || 0)}</Text>
                <Text style={style.stockStatus}>
                    {product.isInStock ? "In Stock" : "Out of Stock"}
                </Text>
                <View style={style.rating}>
                    <Icon name="star" size={16} color={COLORS.yellow} />
                    <Icon name="star" size={16} color={COLORS.yellow} />
                    <Icon name="star" size={16} color={COLORS.yellow} />
                    <Text style={style.ratingText}>{product.rating || 'N/A'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const showNotification=()=>{
  Toast.show({
    type: "info",
    text1: "You don't have any notifications yet!",
    visibilityTime: 5000,
  });
}

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
          <Pressable onPress={showNotification}>
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
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity activeOpacity={0.8} style={styles.searchButton}>
              <Text style={styles.searchButtonText}>{t("search")}</Text>
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
            data={filteredProducts.filter(product => product !== null)}
            renderItem={({ item }) => item ? <Card product={item} /> : null}          
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={<NoProducts/>} 

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
    marginRight: -6,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default HomeScreen;
