import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { InviteCard } from "../cards/InviteCard";
import SectionHeader from "../SectionHeader";
import { Search } from "lucide-react-native";
import { friends } from "../../../utils/mockData";

const renderItem = ({ item }) => (
  <InviteCard
    profilePicture={item.profilePicture}
    isOnline={item.isOnline}
    name={item.name}
  />
);

const keyExtractor = (item) => item.id.toString();

const InvitesList = () => {
  return (
    <>
      <SectionHeader title="Invites" Icon={Search} />
      <FlatList
        data={friends}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
      />
    </>
  );
};

export default InvitesList;

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
});
