import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { CircleAlert, XIcon } from "lucide-react-native";

const WarningAlert = () => {
  return (
    <View>
      <View className="h-16 w-[90%] mx-[5%] rounded-xl flex flex-row items-center justify-evenly border border-yellow-500/20 bg-yellow-400/20 shadow-md">
        <Pressable className="h-8 w-8 flex flex-col items-center justify-center rounded-full bg-yellow-500">
          <CircleAlert color={"white"} />
        </Pressable>
        <View className="flex flex-col items-center justify-start w-[60%]">
          <Text className="font-semibold text-lg self-start ">Important!</Text>
          <Text className="">
            Please use the recommended plant medicine with caution.
          </Text>
        </View>
        {/* <Pressable className="h-8 w-8 rounded-full">
          <XIcon color={"#000"} />
        </Pressable> */}
      </View>
    </View>
  );
};

export default WarningAlert;

const styles = StyleSheet.create({});
