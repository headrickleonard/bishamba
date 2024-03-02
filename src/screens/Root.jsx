import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import CommunityScreen from './SocialMedia';
import HomeScreen from './Home';
import EcommerceScreen from './Ecommerce';

const initialLayout = { width: Dimensions.get('window').width };

const Root = () => {
  const [index, setIndex] = useState(1); // Initial index set to HomeScreen
  const [routes] = useState([
    { key: 'community', title: 'Community' },
    { key: 'home', title: 'Home' },
    { key: 'ecommerce', title: 'Ecommerce' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'community':
        return <CommunityScreen />;
      case 'home':
        return <HomeScreen />;
      case 'ecommerce':
        return <EcommerceScreen />;
      default:
        return null;
    }
  };

  const renderPager = () => null; // Disabling default pager

  const renderDotIndicator = ({ route }) => (
    <View style={styles.dot} />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderPager={renderPager}
      />
      <View style={styles.indicatorContainer}>
        {routes.map((route, idx) => (
          <View key={idx} style={[styles.dotIndicator, index === idx && styles.activeDotIndicator]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#888',
    marginHorizontal: 4,
  },
  activeDotIndicator: {
    backgroundColor: '#000',
  },
});

export default Root;
