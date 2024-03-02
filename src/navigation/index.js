import { createStackNavigator } from "@react-navigation/stack";
import Home from "./../screens/Home";
import SocialMedia from "./../screens/SocialMedia";
import Ecommerce from "./../screens/Ecommerce";
import CameraScreen from "../screens/Camera";
import OnboardingScreen from "../screens/Onboarding";
import Index from "../screens/Index";
function RootStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
        name="Index"
        component={Index}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
        name="Onboarding"
        component={OnboardingScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
        name="Home"
        // component={Index}
        component={Home}
      />

      <Stack.Screen
        // options={{ headerShown: false }}
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
        // options={{ headerShown: false }}
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
    </Stack.Navigator>
  );
}

export default RootStack;
