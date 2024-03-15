import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from "react-native";
import React, { useState } from "react";
import { toolCategories } from "../utils";
import { AnimatedScrollView } from "@kanelloc/react-native-animated-header-scroll-view";
const dp = require("../assets/icons/cabbage.png");
import { useNavigation } from "@react-navigation/native";

const ShopProfile = ({ shopAvatar, shopName }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="flex flex-col items-center justify-evenly h-24 w-24 my-4 bg-white border border-slate-200 rounded-lg"
      onPress={() => {
        // console.log("pressed..")
        navigation.navigate("Shop");
      }}
    >
      <Image
        source={shopAvatar}
        className="h-12 w-12 rounded-full -mt-8"
        style={{ borderWidth: 2, borderColor: "#e6e6e6" }}
      />
      <Text className="text-slate-700 font-normal text-lg w-full overflow-hidden text-center">
        {shopName}
      </Text>
      <Text className="text-slate-500">5km</Text>
    </TouchableOpacity>
  );
};
const ViewAll = () => {
  return (
    <TouchableOpacity className="flex flex-col items-center justify-center h-24 w-24 my-2 bg-neutral-100 rounded-lg">
      <Image
        source={require("../assets/icons/chevron.png")}
        className="h-8 w-8"
      />
      <Text className="text-sm font-bold text-slate-700">view all</Text>
    </TouchableOpacity>
  );
};
const ProductItem = ({ name, icon, description }) => {
  const width = Dimensions.get("window").width;

  return (
    <View
      className={`h-32 w-[210px]  rounded-lg m-2 p-2 border border-slate-300 bg-slate-200 flex flex-row items-center justify-between overflow-hidden`}
    >
      <View className="w-2/3 h-full">
        <Text className="font-bold text-lg">{name}</Text>
        <Text className="font-semibold text-lg overflow-visible w-full text-green-700">
          stores near you
        </Text>
        <Text className="font-semibold text-sm overflow-visible w-full text-slate-700">
          {description}
        </Text>
      </View>
      <View className="w-1/3 h-full flex flex-col items-center justify-end">
        <Image source={icon} className="h-12 w-12" />
      </View>
    </View>
  );
};
const ShopItem = ({ item }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        marginVertical: 2,
        padding: 2,
      }}
      className="bg-slate-200 rounded-xl"
    >
      <Image
        source={item.image}
        style={{ height: 48, width: "15%" }}
        className="m-1"
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
          <Text>{item.description}</Text>
        </View>
        <Image
          source={require("../assets/icons/chevronR.png")}
          style={{ height: 16, width: 16 }}
        />
      </View>
    </View>
  );
};
const ShopItemList = ({ data }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ShopItem item={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
};
const HeaderComponent = () => {
  const height = Dimensions.get("window").height;

  return (
    <View
      className="bg-red-400"
      style={{
        height: height / 3,
      }}
    >
      <Image
        source={require("../assets/images/terraces.jpeg")}
        className="w-full h-full"
      />
    </View>
  );
};
const TopNavBar = () => {
  const navigation = useNavigation();
  return (
    <View className="bg-neutral-100 w-full">
      <Pressable
        className="w-[94%] mx-3 mb-2 mt-8 h-12 rounded-full bg-slate-200 flex flex-row items-center justify-stretch p-1"
        // onPress={navigation.navigate("Search")}
      >
        <Image
          source={require("../assets/icons/search.png")}
          className="h-4 w-4 ml-2"
        />
        <Text className="text-slate-400 mx-4">search products,stores</Text>
      </Pressable>
    </View>
  );
};
const TopLabel=()=>{
  return(
    <View>
      <Text>search for anything</Text>
    </View>
  )
}
const Ecommerce = () => {
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const shopItems = [
    {
      id: "1",
      name: "Organix Agrovet",
      price: "$10",
      image: require("../assets/icons/cabbage.png"),
    },
    {
      id: "2",
      name: "Organix Agrovet",
      price: "$20",
      image: require("../assets/icons/cabbage.png"),
    },
    {
      id: "3",
      name: "Organix Agrovet",
      price: "$10",
      image: require("../assets/icons/cabbage.png"),
    },
    {
      id: "4",
      name: "Organix Agrovet",
      price: "$20",
      image: require("../assets/icons/cabbage.png"),
    },
  ];
  const data = Array.from(Array(50).keys());
  const [fadeAnim] = useState(new Animated.Value(1)); // Initial fade animation value
  const navigation = useNavigation();

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;
    // Calculate the position to start fading out (10% of the screen height)
    const fadeOutThreshold = screenHeight * 0.1;

    // Fade out the top navigation bar when it's within 10% of the top of the screen
    if (scrollPosition < fadeOutThreshold) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      console.log("intercepted...");
    } else {
      // Fade in the top navigation bar when it's beyond 10% of the top of the screen
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      console.log("not intercepted...");
    }
  };

  return (
    <AnimatedScrollView
      HeaderNavbarComponent={<HeaderComponent />}
      // TopNavBarComponent={<TopNavBar />}
      TopNavBarComponent={<TopLabel />}
      headerImage={require("../assets/images/terraces.jpeg")}
      // onScroll={handleScroll}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="">
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            className="w-[94%] mx-3 mt-2 mb-8 h-12 rounded-full bg-slate-200 flex flex-row items-center justify-stretch p-1"
            // onPress={navigation.replace('Search')}
          >
            <Image
              source={require("../assets/icons/search.png")}
              className="h-4 w-4 ml-2"
            />
            <Text className="text-slate-400 mx-4">search products,stores</Text>
          </TouchableOpacity>
        </Animated.View>
        <View className="flex flex-row items-center justify-evenly flex-wrap mb-2 mt-4">
          <ShopProfile shopAvatar={dp} shopName={"agrovet shop"} />
          <ShopProfile
            shopAvatar={require("../assets/images/farm.jpeg")}
            shopName={"agrovet shop"}
          />
          <ShopProfile
            shopAvatar={require("../assets/images/tractor.png")}
            shopName={"agrovet shop"}
          />
          <ShopProfile
            shopAvatar={require("../assets/images/terraces.jpeg")}
            shopName={"agrovet shop"}
          />
          <ShopProfile
            shopAvatar={require("../assets/images/girl.jpg")}
            shopName={"agrovet shop"}
          />
          <ViewAll />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {toolCategories.map((category) => (
            <ProductItem
              description={category.description}
              icon={category.icon}
              name={category.name}
              key={category.id}
            />
          ))}
        </ScrollView>
        <Text className="text-xl font-bold mx-4 my-8">All stores in</Text>
        <View>
          <ShopItemList data={shopItems} />
        </View>
      </ScrollView>
    </AnimatedScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: "gray",
  },
});

export default Ecommerce;
