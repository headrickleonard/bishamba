import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import { PRIMARY_COLOR } from "../styles/styles";

const shops = [
  {
    name: "Yau Sabrina Jackson Agro-Vet",
    image: "https://i.pravatar.cc/300",
    verified: true,
  },
  {
    name: "Tomas Hilton Agro-Vet",
    image: "https://i.pravatar.cc/300",
    verified: false,
  },
  {
    name: "Jason Rey Agro-Vet",
    image: "https://i.pravatar.cc/300",
    verified: true,
  },
  {
    name: "Sophia Ashton Agro-Vet",
    image: "https://i.pravatar.cc/300",
    verified: false,
  },
  {
    name: "Amori Cilton Agro-Vet",
    image: "https://i.pravatar.cc/300",
    verified: true,
  },
  {
    name: "Ashton Lee Agro-Vet",
    image: "https://i.pravatar.cc/300",
    verified: false,
  },
  {
    name: "David Jolie Agro-Vet",
    image: "https://i.pravatar.cc/300",
    verified: true,
  },
  {
    name: "Aaron Garey Agro-Vet",
    image: "https://i.pravatar.cc/300",
    verified: false,
  },
];

const trimName = (name, maxLength, isExpanded) => {
  if (isExpanded) return name;
  return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
};

const Shops = () => {
  const [expandedNames, setExpandedNames] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (name) => {
    setExpandedNames((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search agro-vet shops"
          cursorColor={"green"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>All Shops</Text>
      <FlatList
        data={filteredShops}
        keyExtractor={(item) => item.name}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.shopContainer}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.profileImage} />
              {item.verified && (
                <Octicons
                  name="verified"
                  size={20}
                  color={PRIMARY_COLOR}
                  style={styles.checkmark}
                />
              )}
            </View>
            <TouchableOpacity
              onPress={() => toggleExpand(item.name)}
              activeOpacity={0.8}
            >
              <Text style={styles.shop}>
                {trimName(item.name, 10, expandedNames[item.name])}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingTop: 36,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 36,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 24,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
  },
  shopContainer: {
    flex: 1,
    alignItems: "center",
    margin: 10,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  checkmark: {
    position: "absolute",
    bottom: 8,
    right: 2,
  },
  shop: {
    fontSize: 16,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginTop: 20,
  },
  recent: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default Shops;
