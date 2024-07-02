// screens/SocialFeedScreen.js
import React, { useState } from "react";
import { View, FlatList, StyleSheet, Button } from "react-native";
import PostComponent from "../components/PostComponent";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { Appbar, Avatar } from "react-native-paper";

const initialPosts = [
  {
    id: "1",
    username: "Farmer Joe",
    userImage:
      "https://images.unsplash.com/photo-1522177850482-2dd14e600165?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGpvaG4lMjBkb2V8ZW58MHx8MHx8fDA%3D",
    content: "Just harvested my first batch of tomatoes!",
    image: "https://example.com/tomatoes.jpg",
  },
  {
    id: "2",
    username: "AgriTech Guru",
    userImage:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGpvaG4lMjBkb2V8ZW58MHx8MHx8fDA%3D",
    content: "Using drone technology to monitor crops is a game changer!",
  },
  {
    id: "3",
    username: "Farmer Joe",
    userImage:
      "https://images.unsplash.com/photo-1522177850482-2dd14e600165?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGpvaG4lMjBkb2V8ZW58MHx8MHx8fDA%3D",
    content: "Just harvested my first batch of tomatoes!",
    image: "https://example.com/tomatoes.jpg",
  },
  {
    id: "4",
    username: "AgriTech Guru",
    userImage:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGpvaG4lMjBkb2V8ZW58MHx8MHx8fDA%3D",
    content: "Using drone technology to monitor crops is a game changer!",
  },
];

const SocialFeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState(initialPosts);

  return (
    // <ScreenWrapper>
    <View style={styles.container}>
      {/* <Button
          title="Create Post"
          onPress={() => navigation.navigate("CreatePost")}
        /> */}
      <Appbar.Header>
        <Appbar.Content title="Social Feed" />
        <Appbar.Action
          icon="pencil"
          onPress={() =>
            navigation.navigate("CreatePost", {
              addPost: (newPost) => console.log(newPost),
            })
          }
        />
      </Appbar.Header>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostComponent post={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        // showsVerticalScrollIndicator="false"
      />
    </View>
    // {/* </ScreenWrapper> */}
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f2f2f2",
  },
  list: {
    paddingBottom: 60,
  },
});

export default SocialFeedScreen;
