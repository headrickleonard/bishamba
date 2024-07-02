import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";
import SectionHeader from "../SectionHeader";
import NotificationCard from "../cards/NotificationCard";
import { notifications } from "../../../utils/mockData";

const renderItem = ({ item }) => (
  <NotificationCard notification={item} />
);

const keyExtractor = (item) => item.id.toString();

const NotificationList = () => {
  return (
    <>
      <SectionHeader title="Notifications" Icon={Search} />
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.contentContainer}
      />
    </>
  );
};

export default NotificationList;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
});
