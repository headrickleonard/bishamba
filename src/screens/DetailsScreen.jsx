import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { ActivityIndicator, Button, Dialog, Portal,MD2Colors } from "react-native-paper";
import LoopText from "react-native-loop-text";
import LottieView from "lottie-react-native";


import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { width, height } = Dimensions.get("window");
const open = false;
// const[open,setOpen]=useState(false)

const ScanningDialog = ({ visible, hideDialog }) => {
  // const [visible, setVisible] = React.useState(false);
  // const hideDialog = () => setVisible(false);
  return (
    // <Portal>
    //   <Dialog visible={visible} onDismiss={hideDialog}>
    //     <Dialog.Actions>
    //       <Button onPress={() => console.log("Cancel")}>Cancel</Button>
    //       <Button onPress={() => console.log("Ok")}>Ok</Button>
    //     </Dialog.Actions>
    //   </Dialog>
    // </Portal>
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={hideDialog}
        className=" h-[40%] border-none outline-none rounded-lg border-green-500"
      >
        <Dialog.Icon icon="line-scan" />
        <Dialog.Title className="text-center font-bold">
        <LoopText
          textArray={["scanning..", "analysing.."]}
          className="text-black text-center font-bold text-3xl rounded-full"
        />
        </Dialog.Title>
        <Dialog.Content>
          {/* <Text variant="bodyMedium">please be patient as we're analysing your plant</Text> */}
          {/* <ActivityIndicator animating={true} className="mt-4" color={MD2Colors.green700}/> */}
          {/* <Image source={require('../assets/images/scan.png')} className="h-full w-full -mt-12"/> */}
          <View className="flex flex-row items-center justify-center">

          <LottieView
          source={require("../assets/anime/loader1.json")}
          autoPlay
          loop
          style={{width:120,height:120,backgroundColor:"transparent"}}
        />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => console.log("Cancel")} className=" text-white bg-red-500"
          // loading
          >Cancel</Button>
          {/* <Button onPress={() => console.log("Ok")}>Ok</Button> */}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
function App({ imageUri }) {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
    onEnd: () => {
      scale.value = withTiming(1);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: -width / 2 },
        { translateY: -height / 2 },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: width / 2 },
        { translateY: height / 2 },
      ],
    };
  });

  const focalPointStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: focalX.value }, { translateY: focalY.value }],
    };
  });

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.View style={{ height: "100%", width: "100%" }}>
        <AnimatedImage
          style={[{ flex: 1 }, rStyle]}
          source={{ uri: imageUri }}
        />
        {/* <Animated.View style={[styles.focalPoint, focalPointStyle]} /> */}
        <Animated.View
          className=" w-full bg-transparent rounded-xl absolute bottom-0"
          style={{ height: "20%" }}
        >
          <Button
            icon="camera-iris"
            mode="contained-tonal"
            onPress={showDialog}
            className="bg-green-500 w-[60%] ml-[25%] my-8"
            labelStyle={{ color: "white" }}
          >
            start scanning
          </Button>
          <ScanningDialog visible={dialogVisible} hideDialog={hideDialog} />
        </Animated.View>
      </Animated.View>
    </PinchGestureHandler>
  );
}

const DetailsScreen = ({ route }) => {
  const { photo } = route.params;

  return (
    // <View style={styles.container}>
    //   <Image source={{ uri: photo }} style={styles.image} />
    // </View>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App imageUri={photo} />
    </GestureHandlerRootView>
  );
  // <GestureHandlerRootView style={{ flex: 1 }}>
  //   <App imageUri={photo} />
  // </GestureHandlerRootView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    width: 20,
    height: 20,
    backgroundColor: "#0076ff",
    borderRadius: 10,
  },
});

export default DetailsScreen;
