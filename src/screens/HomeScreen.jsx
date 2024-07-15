import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../const/colors";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { viewAllCategories, getAllProducts } from "../api";
import HomeLoader from "../components/loaders/HomeLoader";
const width = Dimensions.get("window").width / 2 - 30;

const HomeScreen = ({ navigation }) => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // State to manage loading

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
      setLoading(false); // Set loading to false after fetching
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

  // const filterProducts = () => {
  //   let filtered = products;

  //   if (categoryIndex > 0) {
  //     filtered = filtered.filter(
  //       (product) => product.category === categories[categoryIndex]
  //     );
  //   }

  //   if (searchQuery) {
  //     filtered = filtered.filter((product) =>
  //       product.name.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   }

  //   setFilteredProducts(filtered);
  // };


  const filterProducts = () => {
    let filtered = products; // Start with all products
  
    if (categoryIndex > 0) { // Check if a specific category is selected (index > 0)
      const selectedCategory = categories[categoryIndex]; // Get the selected category name
      filtered = products.filter((product) => product.category === selectedCategory);
    }
  
    if (searchQuery) { // Apply search query filtering if there is a search query
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
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Details", product)}
      >
        <View style={style.card}>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: product.isInStock
                  ? "rgba(245, 42, 42,0.2)"
                  : "rgba(0,0,0,0.2) ",
              }}
            >
              <Icon
                name="favorite"
                size={18}
                color={product?.isInStock ? COLORS.red : COLORS.black}
              />
            </View>
          </View>

          <View
            style={{
              height: 100,
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: product.images.main }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
                flex: 1,
              }}
              onError={() => console.log("Error loading image")}
            />
          </View>

          <Text style={{ fontWeight: "bold", fontSize: 15, marginTop: 10 }}>
            {product.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <Text style={{ fontSize: 19, fontWeight: "bold" }}>
              ${product.price}
            </Text>
            <View
              style={{
                height: 25,
                width: 25,
                backgroundColor: COLORS.green,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  color: COLORS.white,
                  fontWeight: "bold",
                }}
              >
                +
              </Text>
            </View>
          </View>
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
          <View style={style.searchContainer}>
            <Icon name="search" size={25} style={{ marginLeft: 20 }} />
            <TextInput
              placeholder="Search"
              style={style.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Pressable
            style={style.sortBtn}
            onPress={() => {
              navigation.navigate("ShopsList");
            }}
          >
            <Icon name="sort" size={30} color={COLORS.white} />
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
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
