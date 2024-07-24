// NotificationCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationCard = ({ message }) => {
  return (
    <View style={styles.card}>
      <Text>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
});

export default NotificationCard;
