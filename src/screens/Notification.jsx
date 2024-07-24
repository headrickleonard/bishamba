// App.js
import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import SwipeableNotification from '../components/notifications/SwipeableNotification';

const App = () => {
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'Notification 1' },
    { id: '2', message: 'Notification 2' },
    { id: '3', message: 'Notification 3' },
  ]);

  const handleSwipe = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const renderItem = ({ item }) => (
    <SwipeableNotification message={item.message} onSwipe={() => handleSwipe(item.id)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
});

export default App;
