import { StyleSheet, FlatList } from "react-native";
import React from "react";
import GroupCard  from "../cards/GroupCard";
import { Search } from "lucide-react-native"; // Example icons
import SectionHeader from "../SectionHeader";
import { groups } from "../../../utils/mockData";

// RenderItem function
const renderItem = ({ item }) => (
  <GroupCard
    Icon={item.Icon}
    color={item.color}
    groupName={item.groupName}
    description={item.description}
    membersCount={item.membersCount}
    followersCount={item.followersCount}
    followersIncluding={item.followersIncluding}
    avatars={item.avatars}
    onAddPress={() => alert(`Join ${item.groupName}`)}
    timestamp={item.timestamp}
  />
);

// KeyExtractor function
const keyExtractor = (item) => item.id.toString();

const GroupList = () => {
  return (
    <>
      <SectionHeader title="Groups" Icon={Search} />
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.container}
      />
    </>
  );
};

export default GroupList;

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
});
