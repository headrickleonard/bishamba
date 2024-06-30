import React, { useState,useRef } from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  MD2Colors,
} from "react-native-paper";
import LoopText from "react-native-loop-text";
import LottieView from "lottie-react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Feedback from "../components/form/Feedback";
import ScreenWrapper from "../components/shared/ScreenWrapper";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { width, height } = Dimensions.get("window");


const ScanningDialog = ({ visible, hideDialog, sheet }) => {
  const openFeedbackSheet = () => {
    if (sheet.current) {
      hideDialog(); // Optionally hide the dialog after opening the sheet
      sheet.current.open();
    } else {
      console.error('Sheet reference is not defined');
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} className="bg-black/50 border border-teal-500/20 rounded-md" >
        {/* <Dialog.Icon icon="line-scan" /> */}
        <Dialog.Title>
          {/* <LoopText textArray={["scanning..", "analysing.."]} /> */}
        </Dialog.Title>
        <Dialog.Content className="">
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <LottieView
              source={require("../assets/anime/scan.json")}
              autoPlay
              loop
              style={{
                // width: 120,
                height: 120,
                backgroundColor: "transparent",
              }}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={openFeedbackSheet}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

function App({ imageUri, showDialog }) {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

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

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.View style={{ height: '100%', width: '100%' }}>
        <AnimatedImage style={[{ flex: 1 }, rStyle]} source={{ uri: imageUri }} />
        <Animated.View style={{ height: '20%', backgroundColor: 'transparent', position: 'absolute', bottom: 0, width: '100%' }}>
          <Button
            icon="camera-iris"
            mode="contained-tonal"
            onPress={showDialog}
            style={{ backgroundColor: 'green', width: '60%', alignSelf: 'center', marginVertical: 16 }}
            labelStyle={{ color: 'white' }}
          >
            Start Scanning
          </Button>
        </Animated.View>
      </Animated.View>
    </PinchGestureHandler>
  );
}

const DetailsScreen = ({ route }) => {
  const { photo } = route.params;
  const sheet = useRef(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  return (
    // <View style={styles.container}>
    //   <Image source={{ uri: photo }} style={styles.image} />
    // </View>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App imageUri={photo} showDialog={showDialog} />
      <ScanningDialog
        visible={dialogVisible}
        hideDialog={hideDialog}
        sheet={sheet}
      />
      <RBSheet
        customStyles={{
          container: { borderTopLeftRadius: 14, borderTopRightRadius: 14 },
        }}
        height={400}
        openDuration={250}
        ref={sheet}
      >
        <Feedback />
      </RBSheet>
    </GestureHandlerRootView>
  );
  
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
  sheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
});

export default DetailsScreen;
