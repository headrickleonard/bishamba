import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, RefreshControl } from "react-native";
import PostCard from "../components/social/cards/PostCard";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { getAllPosts } from "../api";
import { useAuth } from "../contexts/AuthContext";
import PostsLoader from "../components/loaders/PostsLoader";
import GenericPostLoader from './../components/loaders/PostsGenericLoader';

const Threads = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getAllPosts();
        setPosts(postsData);
        console.log("The fetched posts are:", postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const postsData = await getAllPosts();
      setPosts(postsData);
      console.log("The fetched posts are:", postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <GenericPostLoader />
          {/* <PostsLoader /> */}
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={["#9Bd35A", "#689F38"]}
              progressBackgroundColor="#fff"
            />
          }
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 72,
  },
});

export default Threads;
