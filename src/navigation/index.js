import { createStackNavigator } from "@react-navigation/stack";
import Home from "./../screens/Home";
import SocialMedia from "./../screens/SocialMedia";
import Ecommerce from "./../screens/Ecommerce";
import CameraScreen from "../screens/Camera";
import OnboardingScreen from "../screens/Onboarding";
import Index from "../screens/Index";
import SearchPage from "../screens/SearchPage";
import DetailsScreen from "../screens/DetailsScreen";
import { Animated } from "react-native";
import Shop from "../screens/Shop";
import ProductDetails from "../screens/ProductDetails";
import HomeScreen from "../screens/HomeScreen";
import Details from './../screens/Details';
import Notification from './../screens/Notification';
import ResultsScreen from './../screens/ResultScreen';
import CreatePostScreen from "../screens/CreatePostScreen";
function RootStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
        name="Onboarding"
        component={OnboardingScreen}
      /> */}
      {/* <Stack.Screen
        options={{
          headerShown: false,
          // gestureEnabled: true,
        }}
        name="Index"
        component={Index}
      /> */}
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
        name="Home"
        // component={Index}
        // component={Home}
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
        name="Notifications"
        // component={Index}
        // component={Home}
        component={Notification}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
        name="CreatePost"
        // component={Index}
        // component={Home}
        component={CreatePostScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
        name="ScanDetails"
        component={DetailsScreen}
      />
      <Stack.Screen
        name="Details"
        // component={Index}
        component={Details}
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          gestureResponseDistance: 150,
          cardStyleInterpolator: ({ current, next, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                      extrapolateRight: "clamp",
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
        name="Search"
        // component={Index}
        component={SearchPage}
      />
      <Stack.Screen
        name="Media"
        component={SocialMedia}
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          gestureResponseDistance: 150,
          cardStyleInterpolator: ({ current, next, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                      extrapolateRight: "clamp",
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      <Stack.Screen
        name="Shops"
        component={Ecommerce}
        options={{
          headerShown: false,
          // gestureEnabled: true,
          // gestureDirection: "horizontal",
          // gestureResponseDistance: 10,
          // cardStyleInterpolator: ({ current, next, layouts }) => {
          //   return {
          //     cardStyle: {
          //       transform: [
          //         {
          //           translateX: current.progress.interpolate({
          //             inputRange: [0, 1],
          //             outputRange: [layouts.screen.width, 0],
          //             extrapolateRight: "clamp",
          //           }),
          //         },
          //       ],
          //     },
          //   };
          // },a
        }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          gestureResponseDistance: 150,
          cardStyleInterpolator: ({ current, next, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                      extrapolateRight: "clamp",
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      <Stack.Screen
        name="Shop"
        component={Shop}
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          gestureResponseDistance: 150,
          cardStyleInterpolator: ({ current, next, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                      extrapolateRight: "clamp",
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          gestureResponseDistance: 150,
          cardStyleInterpolator: ({ current, next, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                      extrapolateRight: "clamp",
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Results', headerShown: false }} />

    </Stack.Navigator>
  );
}

export default RootStack;
