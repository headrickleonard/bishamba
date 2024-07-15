import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../const/colors";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { PRIMARY_COLOR } from "../styles/styles";
import { getProductById } from "../api";
import { convertUSDToTZS } from "./../utils/index";

const ProductDetails = ({ navigation, route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await getProductById(productId);
        if (response && response.data) {
          setProduct(response.data);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    return () => {
      console.log("th product id is:", productId);
    };
  }, []);

  if (loading) {
    return (
      <View style={style.centered}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={style.centered}>
        <Text style={style.errorText}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={style.safeArea}>
        <View style={style.header}>
          <Pressable style={style.iconButton}>
            <Icon
              name="arrow-back"
              size={24}
              onPress={() => navigation.goBack()}
            />
          </Pressable>
          <Pressable style={style.iconButton}>
            <Icon name="shopping-cart" size={24} />
          </Pressable>
        </View>
        <View style={style.imageContainer}>
          <Image
            source={{ uri: product.images.main }}
            style={style.productImage}
          />
        </View>
        <View style={style.productDetailsContainer}>
          <View style={style.brandContainer}>
            <View style={style.line} />
            <Text style={style.brandText}>{product.brand}</Text>
          </View>
          <View style={style.productHeader}>
            <Text style={style.productName}>{product.name}</Text>
            <View style={style.priceTag}>
              <Text style={style.priceText}>{convertUSDToTZS(product?.price.toString())} /=</Text>
            </View>
          </View>
          <View style={style.productDescriptionContainer}>
            <Text style={style.aboutText}>About</Text>
            <Text style={style.descriptionText}>{product.description}</Text>
            <View style={style.actionsContainer}>
              <View style={style.counter}>
                <TouchableOpacity
                  disabled={value <= 1}
                  onPress={() => setValue(value - 1)}
                  style={style.counterAction}
                >
                  <Text style={style.counterActionText}>-</Text>
                </TouchableOpacity>
                <Text style={style.counterValue}>{value}</Text>
                <TouchableOpacity
                  onPress={() => setValue(value + 1)}
                  style={style.counterAction}
                >
                  <Text style={style.counterActionText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={style.buyBtn}>
                <Text style={style.buyBtnText}>Connect</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    borderRadius: 50,
    padding: 8,
  },
  imageContainer: {
    flex: 0.45,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    flex: 1,
  },
  productDetailsContainer: {
    flex: 0.55,
    backgroundColor: COLORS.light,
    marginHorizontal: 7,
    marginBottom: 7,
    borderRadius: 20,
    marginTop: 30,
    paddingTop: 30,
  },
  brandContainer: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  line: {
    width: 25,
    height: 2,
    backgroundColor: COLORS.dark,
    marginBottom: 5,
    marginRight: 3,
  },
  brandText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productHeader: {
    marginLeft: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  priceTag: {
    backgroundColor: COLORS.green,
    width: 120,
    height: 40,
    justifyContent: "center",
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  priceText: {
    marginLeft: 15,
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  productDescriptionContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  aboutText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionText: {
    color: "grey",
    fontSize: 16,
    lineHeight: 22,
    marginTop: 10,
  },
  actionsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    borderStyle: "solid",
    borderRadius: 8,
    height: 36,
  },
  counterAction: {
    width: 46,
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  counterActionText: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "500",
    color: "#000",
  },
  counterValue: {
    minWidth: 34,
    fontSize: 14,
    fontWeight: "500",
    color: "#101010",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  buyBtn: {
    width: 130,
    height: 40,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  buyBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductDetails;
