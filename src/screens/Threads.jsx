import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import PostCard from "../components/social/cards/PostCard";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { getAllPosts } from "../api"; // No getMorePosts function
import { useAuth } from "../contexts/AuthContext";
import GenericPostLoader from "../components/loaders/PostsGenericLoader";

const ITEM_HEIGHT = 150; 

const Threads = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getAllPosts();
        setPosts(postsData);
        
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
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = useCallback(({ item }) => <PostCard post={item} />, []);

  const keyExtractor = useCallback((item) => item.id, []);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <GenericPostLoader />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <FlashList
          data={posts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={ITEM_HEIGHT}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={["#9Bd35A", "#689F38"]}
              progressBackgroundColor="#fff"
            />
          }
          showsVerticalScrollIndicator={false}
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
