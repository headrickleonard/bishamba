import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions, Animated } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const NextScreen = () => {
  const navigation = useNavigation();
  const [swiped, setSwiped] = useState(false);
  const translateX = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX > Dimensions.get("window").width / 2) {
        Animated.timing(translateX, {
          toValue: Dimensions.get("window").width,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setSwiped(!swiped);
          navigation.navigate("Shops");
        });
      } else if (
        nativeEvent.translationX <
        -Dimensions.get("window").width / 2
      ) {
        Animated.timing(translateX, {
          toValue: -Dimensions.get("window").width,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setSwiped(!swiped);
          navigation.navigate("Media");
        });
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          bounciness: 10,
          speed:10,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX: translateX }],
            },
          ]}
        >
          <Text style={styles.text}>media shops...</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    width: "80%",
    height: 50,
    borderRadius: 100,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NextScreen;
