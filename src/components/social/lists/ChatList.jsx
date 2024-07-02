import React from "react";
import { StyleSheet, FlatList } from "react-native";
import  MessageCard  from "../cards/MessageCard";
import SectionHeader from "../SectionHeader";
import { Search } from "lucide-react-native";
import { users } from "../../../utils/mockData";

// RenderItem function
const renderItem = ({ item }) => (
  <MessageCard
    profilePicture={item.profilePicture}
    isOnline={item.isOnline}
    name={item.name}
    lastMessage={item.lastMessage}
    timestamp={item.timestamp}
    unreadMessages={item.unreadMessages}
  />
);

// KeyExtractor function
const keyExtractor = (item) => item.id.toString();

const ChatList = () => {
  return (
    <>
      <SectionHeader title="Chats" Icon={Search} />
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.container}
      />
    </>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 16,
  },
});
