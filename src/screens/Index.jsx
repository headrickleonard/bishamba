import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Home from "./Home";
import SocialMedia from "./SocialMedia";
import Ecommerce from "./Ecommerce";

const renderScene = SceneMap({
  home: Home,
  media: SocialMedia,
  shops: Ecommerce,
});
const renderTabBar = () => null;
export default function Index() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "media", title: "Community" },
    { key: "home", title: "Home" },
    { key: "shops", title: "Shops" },
  ]);
  
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar} // Render an empty tab bar
      
    />
  );
}
