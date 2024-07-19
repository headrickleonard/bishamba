import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur"; // or '@react-native-community/blur'
import {
  AtSign,
  Bookmark,
  Earth,
  GiftIcon,
  SendHorizontalIcon,
  Share,
  SmileIcon,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  createComment,
  getCommentsByPost,
  voteOnPost,
} from "../../../api/index";
import { useAuth } from "../../../contexts/AuthContext";
import { PRIMARY_COLOR } from "../../../styles/styles";
import { getRelativeTime } from "../../../utils";
import COLORS from "./../../../const/colors";
import EmptyInbox from './../components/empty/EmptyInbox';

const PostDetailsScreen = ({ route }) => {
  const { post } = route.params; // Retrieve the post passed from the previous screen
  const refRBSheet = useRef();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [profileImage, setProfileImage] = useState(DP);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null);
  const { accessToken, totalTimeSpent, category } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked || false); // State to track if the post is liked

  const [imageSource, setImageSource] = useState({
    uri: post.profilePicture,
  });
  const DP =
    "https://plus.unsplash.com/premium_photo-1661508557554-e3d96f2fdde5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhdXRpZnVsJTIwZ2lybHxlbnwwfHwwfHx8MA%3D%3D";

  const handleSend = async () => {
    if (message.trim()) {
      try {
        const newComment = await createComment(
          accessToken,
          post.id,
          message.trim()
        );

        // setComments((prevComments) => [...prevComments, newComment.data.content]);
        console.log("this is the new comment:", newComment.data.content);
        setMessage("");
      } catch (error) {
        console.error("Failed to create comment:", error.message);
        // Handle error appropriately, e.g., show an error message
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const newComments = await getCommentsByPost(post.id);

      const commentsArray = newComments.flatMap((commentGroup) =>
        commentGroup.data.map((comment) => comment.content)
      );
      setComments(commentsArray);
      console.log("the retrieved comments are:", commentsArray);
    } catch (error) {
      console.error("Error refreshing comments:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (imageSource.uri === post.profilePicture) {
      setLoading(true);
      setError(false);
    }
  }, [imageSource, post.profilePicture]);

  const handleError = () => {
    setLoading(false);
    setError(true);
    setImageSource({
      uri: DP,
    });
  };

  const toggleLike = async () => {
    try {
      const response = await voteOnPost(accessToken, post.id); // Assuming accessToken is defined
      if (response.status === "success") {
        setIsLiked(!isLiked); // Toggle like state in UI
      } else {
        console.error("Failed to toggle like:", response.message);
        // Handle error state or retry logic if needed
      }
    } catch (error) {
      console.error("Error toggling like:", error.response.data);
      // Handle network or other errors
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image
        source={{
          uri: item.profilePicture || DP,
        }}
        style={styles.profileImage}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentText}>{item.content}</Text>
        <View style={styles.commentFooter}>
          <Text style={styles.likesText}>{item.likes} 2 Likes</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.profileContainer}>
            <View style={styles.profileInfo}>
              {loading && (
                <ActivityIndicator
                  style={styles.activityIndicator}
                  size="large"
                  color={PRIMARY_COLOR}
                />
              )}
              <Image
                source={{ uri: DP }} //user's dp
                style={styles.profileImage}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
              />
              <View>
                <Text style={styles.title}>
                  {post.userName || "Unknown User"}
                </Text>
                <View style={styles.liveStoryContainer}>
                  <Earth color={"pink"} size={12} />
                  <Text style={styles.liveStoryText}>Tanzania</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.followButton}
              onPress={() => {}}
            >
              <Text style={styles.followButtonText}>{category}</Text>
            </TouchableOpacity>
          </View>
          {post.images && post.images[0].length > 0 && (
            <Image source={{ uri: post.images[0] }} style={styles.postImage} />
          )}
          <Text style={styles.snippet}>{post.content || "No content"}</Text>
          <View style={styles.footerContainer}>
            <Text style={styles.timeText}>
              Posted {getRelativeTime(post.createdDate) || "some time ago"}
            </Text>
            <View style={styles.iconContainer}>
              <Text style={styles.timeText}>{post.votes.length}</Text>
              <TouchableOpacity style={styles.iconButton} onPress={toggleLike}>
                {isLiked ? (
                  <AntDesign name="heart" size={24} color={COLORS.pink} />
                ) : (
                  <AntDesign name="hearto" size={24} color="pink" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Share color={PRIMARY_COLOR} size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Bookmark color={PRIMARY_COLOR} size={24} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.messageButton}
            activeOpacity={0.8}
            onPress={() => {
              setSheetOpen(true);
              refRBSheet.current.open();
            }}
          >
            <Text style={styles.messageButtonText}>What's up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isSheetOpen && (
        <View style={StyleSheet.absoluteFill}>
          <BlurView intensity={10} style={StyleSheet.absoluteFill} />
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => refRBSheet.current.close()}
          />
        </View>
      )}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RBSheet
          ref={refRBSheet}
          openDuration={250}
          onClose={() => setSheetOpen(false)}
          closeOnDragDown={true}
          closeOnPressMask={true}
          dragFromTopOnly={true}
          height={500}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              elevation: 20,
            },
            draggableIcon: {
              backgroundColor: "#888",
            },
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.sheetContent}
            keyboardVerticalOffset={36}
          >
            <ScrollView
              style={styles.commentsContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["pink", PRIMARY_COLOR]}
                  tintColor={"pink"}
                />
              }
            >
              <FlatList
                data={comments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                 <EmptyInbox/>
                }
              />
            </ScrollView>
            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Add a comment..."
                placeholderTextColor="#888"
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                activeOpacity={0.8}
                onPress={handleSend}
              >
                <SendHorizontalIcon size={24} color="pink" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </RBSheet>
      </GestureHandlerRootView>
    </View>
  );
};

export default PostDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  activityIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -15,
    marginTop: -15,
    zIndex: 1,
  },
  content: {
    padding: 16,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  liveStoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveStoryText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#888",
  },
  followButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  snippet: {
    fontSize: 14,
    color: "#444",
    marginBottom: 16,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#888",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 10,
  },
  messageButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 30,
    marginTop: 16,
  },
  messageButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetContent: {
    flex: 1,
  },
  commentsContainer: {
    flex: 1,
  },
  emptyCommentsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  commentContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentContent: {
    marginLeft: 10,
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    color: "#444",
  },
  commentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  likesText: {
    fontSize: 12,
    color: "#888",
  },
  messageInputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: PRIMARY_COLOR,
  },
});
