import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Anticons from "react-native-vector-icons/AntDesign";

const ProductDetails = ({ route }) => {
  const data = route?.params?.param;
  const [emojis, setEmojis] = useState([]);

  const addEmoji = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const newEmoji = { x: locationX, y: locationY, emoji: "😊" };
    setEmojis([...emojis, newEmoji]);
  };

  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <SafeAreaView className="py-12">
      <View className="">
        <Animated.Image
          entering={FadeInDown.duration(300).springify()}
          source={data.itemIconUrl}
          className="rounded-xl"
          style={{ height: hp(40), width: wp(90), marginHorizontal: wp(5) }}
        />
        {emojis.map((emoji, index) => (
          <TouchableOpacity
            key={index}
            style={{ position: "absolute", left: emoji.x, top: emoji.y }}
            onPress={() => console.log("Emoji pressed:", emoji.emoji)}
          >
            <Text className="text-5xl">{emoji.emoji}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={addEmoji}
          style={{ position: "absolute", bottom: 20, right: 20 }}
        >
          {/* <Text>Add Emoji</Text> */}
        </TouchableOpacity>
      </View>
      <View className="flex flex-col items-center justify-evenly">
        <View
          className="flex flex-col items-start my-4 rounded-lg border border-slate-300 p-2"
          style={{ height: hp(45), width: wp(90) }}
        >
          <View>
            <Text className="text-xl font-bold">Techical Name</Text>

            <Animated.Text
              entering={FadeInDown.duration(300).springify()}
              // style={{ fontSize: hp(3.5) }}
              className="font-semibold text-neutral-800 tracking-wide"
            >
              {/* {data.itemName} */}
              Emamectin Benzoate 1.5% + Fipronil 3.5% SC
            </Animated.Text>
          </View>
          <View>
            <Text className="text-xl font-bold my-2">Cautions</Text>
            <Text>
              1. This insecticide is toxic to fish, uses of this product
              containing should be avoided near aquaculture.
            </Text>
            <Text>
              2. Do not spray during active bee-foraging period of the day.
            </Text>
            <Text>
              3. Exposure to birds should be avoided as the product is toxic to
              birds.
            </Text>
            {/* <Animated.Text
              entering={FadeInUp.duration(500).springify()}
              // style={{ fontSize: hp(4.5) }}
              className="font-normal text-neutral-800 text-lg break-words"
            >
              {data.itemDescription}
            </Animated.Text> */}
          </View>
          <View className="my-2">
            <Animated.Text
              entering={FadeInDown.duration(300).springify()}
              className="font-semibold text-neutral-800 text-xl"
            >
              Target Crops
            </Animated.Text>
            <Text>
              Chilli, Cotton, Cumin, Onion, Garlic, vegetable, and horticulture
              crops
            </Text>
          </View>
          <View className="my-2">
            <Animated.Text
             entering={FadeInDown.duration(300).springify()}
             className="font-semibold text-neutral-800 text-xl"
            >Target Pests</Animated.Text>
            <Text>
              Chilli, Cotton, Cumin, Onion, Garlic, vegetable, and horticulture
              crops
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="bg-green-500 rounded-xl flex flex-col items-center justify-center"
          style={{ height: hp(6), width: wp(90) }}
        >
          <Text className="font-bold text-lg text-slate-800">Buy now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
  
export default ProductDetails;