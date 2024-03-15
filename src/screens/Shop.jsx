import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Button, TouchableRipple} from "react-native-paper";
import { chemicalsData } from "../utils";
import { AnimatedScrollView } from "@kanelloc/react-native-animated-header-scroll-view";
import { useNavigation } from "@react-navigation/native";
function Product({ iconUrl, price, description, name }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{ height: hp(20), width: wp(30) }}
      //   onPress={() => {
      //     console.log("pressed");
      //   }}
      onPress={() => {
        navigation.navigate("ProductDetails", {
          param: {
            itemIconUrl: iconUrl,
            Itemprice: price,
            itemDescription: description,
            itemName: name,
          },
        });
        // navigation.navigate("TopUp");
      }}
      className="flex flex-col items-center justify-evenly border border-slate-300 rounded-xl"
    >
      <Image source={iconUrl} className="w-full h-[60%]" />
      <Text className="font-bold text-lg">{price}</Text>
      <Text className="line-clamp-1">{name}</Text>
    </TouchableOpacity>
  );
}
const HeaderComponent = () => {
  const height = Dimensions.get("window").height;

  return (
    // <View
    //   className="bg-red-400"
    //   style={{
    //     height: height / 3,
    //   }}
    // >
    //   <Image
    //     source={require("../assets/images/terraces.jpeg")}
    //     className="w-full h-full"
    //   />
    // </View>
    <View
     style={{ height: hp(40) }} 
     className="bg-green-700 w-full pt-12">
      <View
        // style={{ width: wp(100), height: hp(30) }}
        className=" flex flex-row items-center justify-evenly mt-4"
      >
        {/* <Button icon="arrow-left" className=" bg-white rounded-full" /> */}
        <View className="w-12 h-12 rounded-full bg-slate-200 flex flex-col items-center justify-center">
        <Image source={require('../assets/icons/arrow.png')} className="w-4 h-4"/>

        </View>
       
        <Image
          source={require("../assets/images/agrovet.png")}
          className="rounded-full h-24 w-24 object-cover"
        />
        <View className="h-12 w-12 rounded-full bg-orange-100 flex flex-col items-center justify-center">
          {/* <Button icon="close" className="rounded-full" /> */}
          <Image source={require('../assets/icons/closered.png')} className="w-4 h-4"/>

        </View>
      </View>
      <View className="w-full flex flex-col items-center justify-center">
        <Text className="font-bold text-lg text-green-500">Distance 2.5km</Text>
        <Text className="font-bold text-lg text-slate-50">Organix Agrovet</Text>
      </View>
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

const Shop = () => {
  return (
    // <SafeAreaView>
    <AnimatedScrollView
      // HeaderNavbarComponent={<HeaderComponent />}
      TopNavBarComponent={<TopNavBar />}
      HeaderComponent=<HeaderComponent />
      // style={{paddingTop:hp(15)}}
      // headerImage={<HeaderComponent/>}
      // headerImage={require("../assets/images/terraces.jpeg")}
      // onScroll={handleScroll}
    >
      <View className="w-full flex flex-row items-center">
        <TextInput
          className="h-12 p-4 border-[1px] border-slate-400 my-4 rounded-full"
          style={{ width: wp(80), marginHorizontal: wp(2) }}
          placeholder="search anything..."
          cursorColor={"#000"}
          inputMode="search"
        />
        {/* <Button
          icon="filter-variant"
          style={{ height: 16, width: 20 }}
          className="rounded-full"
        /> */}
        <TouchableOpacity>

        <Image source={require('../assets/icons/filter.png')} className="h-8 w-8"/>
        </TouchableOpacity>
      </View>
      {/* chemicals section */}
      <View className="w-full h-16 flex flex-row items-center justify-between px-4 py-2">
        <Text className="font-semibold text-lg">chemicals</Text>
        <Text className="font-semibold text-lg text-green-700">view more</Text>
      </View>
      <View className="flex flex-row flex-wrap items-center justify-evenly">
        {chemicalsData.map((chemical) => (
          <Product
            description={chemical.description}
            iconUrl={chemical.icon}
            price={chemical.price}
            key={chemical.id}
            name={chemical.name}
          />
        ))}
      </View>
      <View className="w-full h-16 flex flex-row items-center justify-between px-4 py-2">
        <Text className="font-semibold text-lg">Seeds</Text>
        <Text className="font-semibold text-lg text-green-700">view more</Text>
      </View>
      <View className="flex flex-row flex-wrap items-center justify-evenly">
        {chemicalsData.map((chemical) => (
          <Product
            description={chemical.description}
            iconUrl={chemical.icon}
            price={chemical.price}
            key={chemical.id}
            name={chemical.name}
          />
        ))}
      </View>
      <View className="w-full h-16 flex flex-row items-center justify-between px-4 py-2">
        <Text className="font-semibold text-lg">Machines</Text>
        <Text className="font-semibold text-lg text-green-700">view more</Text>
      </View>
      <View className="flex flex-row flex-wrap items-center justify-evenly">
        {chemicalsData.map((chemical) => (
          <Product
            description={chemical.description}
            iconUrl={chemical.icon}
            price={chemical.price}
            key={chemical.id}
            name={chemical.name}
          />
        ))}
      </View>
      <View className="w-full h-16 flex flex-row items-center justify-between px-4 py-2">
        <Text className="font-semibold text-lg">chemicals</Text>
        <Text className="font-semibold text-lg text-green-700">view more</Text>
      </View>
      <View className="flex flex-row flex-wrap items-center justify-evenly">
        {chemicalsData.map((chemical) => (
          <Product
            description={chemical.description}
            iconUrl={chemical.icon}
            price={chemical.price}
            key={chemical.id}
            name={chemical.name}
          />
        ))}
      </View>
    </AnimatedScrollView>
    // {/* </SafeAreaView> */}
  );
};

export default Shop;
