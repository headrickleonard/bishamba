import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import CustomHeader from "../components/CustomHeader";
import { transition } from "../config";
import AskCommunity from "../screens/AskCommunity";
import Auth from "../screens/Auth";
import CameraScreen from "../screens/Camera";
import ChatDetailScreen from "../screens/ChatDetailScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import DetailsScreen from "../screens/DetailsScreen";
import HomeScreen from "../screens/HomeScreen";
import ImageViewer from "../screens/ImageViewer";
import PlantScanner from "../screens/PlantScanner";
import ProductDetails from "../screens/ProductDetails";
import Shop from "../screens/Shop";
import Shops from "../screens/Shops";
import Details from './../screens/Details';
import ResultsScreen from './../screens/ResultScreen';
import SocialMedia from "./../screens/SocialMedia";



function RootStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>

      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
        name="HomeScreen"

        component={HomeScreen}
      />

      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
        name="CreatePost"

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
        component={Details}
        options={transition}

      />

      <Stack.Screen
        name="Media"
        component={SocialMedia}
        options={transition}
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
      <Stack.Screen
        name="AskComunity"
        component={AskCommunity}
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
