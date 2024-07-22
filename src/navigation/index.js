import { createStackNavigator,TransitionPresets  } from "@react-navigation/stack";
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
import PlantScanner from "../screens/PlantScanner";
import { transition } from "../config";
import ChatDetailScreen from "../screens/ChatDetailScreen";
import Shops from "../screens/Shops";
import CustomHeader from "../components/CustomHeader";
import { slideTransition } from "../const/spring";
import Auth from "../screens/Auth";
import ImageViewer from "../screens/ImageViewer";



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
        name="PlantScanner"
        component={PlantScanner}
        options={transition}
      />
      <Stack.Screen
        name="ShopsList"
        component={Shops}
        options={transition}
      // options={{
      //   headerShown:true,
      //   headerTitle:"All shops",
      //   headerMode:"float",
      // }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatDetailScreen}
        options={{
          headerShown: true,
          headerTitle: "Message"
        }}
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
        options={transition}
      
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
        options={transition}
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
        options={transition}
      />
      <Stack.Screen
        name="Shop"
        component={Shop}
        options={transition}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={transition}
      />
      <Stack.Screen
        name="Auth"
        component={Auth}
        options={transition}
      />
      <Stack.Screen
        name="ImageViewer"
        component={ImageViewer}
        options={transition}
      />
      <Stack.Screen name="Results"
        component={ResultsScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
          ...TransitionPresets.SlideFromRightIOS, 
          // ...slideTransition,

          headerStyle: {
            height: 100, 
          },
          headerTransparent: true,
        })}
      />

    </Stack.Navigator>
  );
}




export default RootStack;
