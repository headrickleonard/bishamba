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
import EmptyInbox from "../../empty/EmptyInbox";

const PostCard = ({ post }) => {
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
  const [likeLoading, setLikeLoading] = useState(false); // State to track like request loading

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
    setLikeLoading(true); // Start loading

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
    } finally {
      setLikeLoading(false); // End loading
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
                {likeLoading ? (
                  <ActivityIndicator size="small" color={COLORS.pink} />
                ) : isLiked ? (
                  <AntDesign name="heart" size={24} color={COLORS.pink} />
                ) : (
                  <AntDesign name="hearto" size={24} color="pink" />
                )}
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.iconButton}>
                <Share color={PRIMARY_COLOR} size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Bookmark color={PRIMARY_COLOR} size={24} />
              </TouchableOpacity> */}
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
            <Text style={styles.messageButtonText}>Respond</Text>
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
                  colors={["red", PRIMARY_COLOR, "#0076ff"]}
                  title="comments"
                  titleColor={"red"}
                  role="dialog"
                />
              }
            >
              {/* {comments.map((comment, index) => (
                <Text key={index} style={styles.comment}>
                  {comment.content}
                </Text>
              ))} */}
              <FlatList
                data={comments}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                  <EmptyInbox
                    title={"No comments yet!"}
                    subtitle={"Be the first to drop a comment here"}
                  />
                }
              />
            </ScrollView>

            <View style={styles.inputContainer}>
              <View style={styles.row}>
                <TouchableOpacity style={styles.profilePicture}>
                  <Image
                    source={{ uri: post.profilePicture || DP }}
                    style={styles.profileImage}
                  />
                </TouchableOpacity>

                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Type your message here..."
                    value={message}
                    onChangeText={setMessage}
                    style={styles.textInput}
                  />
                  <View style={styles.iconContainer}>
                    <TouchableOpacity style={styles.iconButton}>
                      <AtSign color={"#ff69b4"} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                      <GiftIcon color={"#ff69b4"} size={24} />
                    </TouchableOpacity>
                    {message ? (
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={handleSend}
                      >
                        <SendHorizontalIcon color={"#ff69b4"} size={24} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setIsEmojiPickerVisible(true)}
                      >
                        <SmileIcon color={"#ff69b4"} size={24} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </RBSheet>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
    borderRadius: 12,
    borderColor: "#d9dbde",
    borderWidth: 0.5,
    marginHorizontal: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 4,
  },
  liveStoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveStoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff69b4",
    marginLeft: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 2,
  },
  followButton: {
    // backgroundColor: PRIMARY_COLOR,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  followButtonText: {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
  },
  snippet: {
    fontSize: 16,
    marginVertical: 10,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: "#888",
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
  messageButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sheetContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  commentsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  comment: {
    fontSize: 16,
    marginVertical: 5,
    backgroundColor: "#f1f1f1",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    padding: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  textInput: {
    flex: 1,
    height: 32,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 8,
  },
  textureOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  activityIndicator: {
    position: "absolute",
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
    marginLeft: 10,
  },
  commentText: {
    fontSize: 16,
  },
  commentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  likesText: {
    color: "gray",
  },
});

export default PostCard;
