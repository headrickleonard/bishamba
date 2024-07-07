import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

// MessageCard Component
const MessageCard = ({
  profilePicture,
  isOnline,
  name,
  lastMessage,
  timestamp,
  unreadMessages,
  onCardPress,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity activeOpacity={0.95} style={styles.card} onPress={() => navigation.navigate('Chat')}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        {isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.lastMessage}>{lastMessage}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        {unreadMessages > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadMessages}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ececec",
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 0.5,
  },
  profileContainer: {
    position: "relative",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00FF00",
    borderWidth: 2,
    borderColor: "#fff",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  lastMessage: {
    color: "#888",
    fontSize: 14,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  timestamp: {
    color: "#888",
    fontSize: 12,
  },
  unreadBadge: {
    marginTop: 5,
    backgroundColor: "#6246ea",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default MessageCard;
