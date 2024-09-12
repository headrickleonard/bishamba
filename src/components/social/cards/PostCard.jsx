import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  AtSign,
  GiftIcon,
  SendHorizontalIcon,
  SmileIcon,
  Earth,
  Speech,
  MessageCircleDashedIcon,
  LocateFixedIcon
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
  voteOnComment,
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
  const [imageSource, setImageSource] = useState(DP);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken, totalTimeSpent, category } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(post.votes.length);

  const DP =
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740&t=st=1721577394~exp=1721577994~hmac=0dcd162551b0da58abf8cae491250a34fb7091ab2a495548605f17149fecd0a9";
  const handleSend = async () => {
    if (message.trim()) {
      try {
        const newComment = await createComment(
          accessToken,
          post.id,
          message.trim()
        );
        // setComments((prevComments) => [
        //   ...prevComments,
        //   newComment.data.content,
        // ]);
        setMessage("");
      } catch (error) {
        console.error("Failed to create comment:", error.message);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const newComments = await getCommentsByPost(post.id);
      // const commentsArray = newComments.flatMap((commentGroup) =>
      //   commentGroup.data.map((comment) => ({
      //     ...comment.content,
      //     id: comment.id, // Ensure each comment has an id
      //     votes: comment.votes || [],
      //     profilePicture: comment.profilePicture || DP,
      //   }))
      // );
      const commentsArray = newComments.data.map((comment) => ({
        id: comment.id,
        content: comment.content,
        votes: comment.votes || [],
        profilePicture: comment.profilePicture || DP,
      }));
      setComments(commentsArray);
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
    if (imageSource?.uri === post.profilePicture) {
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

  // const toggleLike = async () => {
  //   setLikeLoading(true);
  //   try {
  //     const response = await voteOnPost(accessToken, post.id);
  //     if (response.status === "success") {
  //       setIsLiked(!isLiked);
  //     } else {
  //       console.error("Failed to toggle like:", response.message);
  //     }
  //   } catch (error) {
  //     console.error("Error toggling like:", error.response.data);
  //   } finally {
  //     setLikeLoading(false);
  //   }
  // };

  const toggleLike = async () => {
    setLikeLoading(true);

    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;

    // Update the local state immediately
    setLikesCount(newLikesCount);
    setIsLiked(newIsLiked);

    try {
      // Perform the server request
      const response = await voteOnPost(accessToken, post.id);

      if (response.status !== "success") {
        throw new Error(response.message);
      }

      // Update the local state to reflect the new like count
      // No need to update votes directly as we're only tracking if the post is liked
    } catch (error) {
      console.error("Error toggling like:", error.message);
      // Revert the local state if the server request fails
      setLikesCount(likesCount);
      setIsLiked(!newIsLiked);
    } finally {
      setLikeLoading(false);
    }
  };

  const toggleCommentLike = async (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, isLiked: !comment.isLiked, likeLoading: true }
          : comment
      )
    );
    try {
      const response = await voteOnComment(accessToken, commentId);
      if (response.status === "success") {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, likeLoading: false }
              : comment
          )
        );
      } else {
        console.error(
          "Failed to toggle like on this comment:",
          response.message
        );
      }
    } catch (error) {
      console.error("Error toggling like on comment:", error.response.data);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, isLiked: !comment.isLiked, likeLoading: false }
            : comment
        )
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image
        source={{
          uri: item?.profilePicture || DP,
        }}
        style={styles.profileImage}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentText}>{item?.content}</Text>
        <View style={styles.commentFooter}>
          <Text style={styles.likesText}>{item?.votes?.length} Likes</Text>
          <TouchableOpacity
            className="flex right-4 rounded-full border-2 border-white bg-[#F1F1F1] items-center justify-center p-1 -bottom-2"
            onPress={() => {
              toggleCommentLike(item.id);
            }}
          >
            {item.likeLoading ? (
              <ActivityIndicator size="small" color={COLORS.pink} />
            ) : item.isLiked ? (
              <AntDesign name="heart" size={16} color={COLORS.pink} />
            ) : (
              <AntDesign name="hearto" size={16} color="pink" />
            )}
          </TouchableOpacity>
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
                source={{ uri: DP }}
                style={styles.profileImage}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
              />
              <View>
                <Text style={styles.title}>
                  {post.userName || "Unknown User"}
                </Text>
                <View style={styles.liveStoryContainer}>
                  <LocateFixedIcon size={12} color={"#ff69b4"} />
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
              <Text style={styles.timeText}>{likesCount}</Text>
              <TouchableOpacity style={styles.iconButton} onPress={toggleLike}>
                {likeLoading ? (
                  <ActivityIndicator size="small" color={COLORS.pink} />
                ) : isLiked ? (
                  <AntDesign name="heart" size={24} color={COLORS.pink} />
                ) : (
                  <AntDesign name="hearto" size={24} color="pink" />
                )}
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
            <Speech color={"#fff"} size={24} style={{ marginHorizontal: 8 }} />
            <Text style={styles.messageButtonText}>Join the Fray</Text>
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
            {/* <ScrollView
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
            > */}
            <FlatList
              data={comments}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <EmptyInbox
                  title={"No comments yet!"}
                  subtitle={"Be the first to drop a comment here"}
                />
              }
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["red", PRIMARY_COLOR, "#0076ff"]}
                />
              }
            />
            {/* </ScrollView> */}

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
  content: {
    padding: 20,
    borderRadius: 12,
    borderColor: "#d9dbde",
    borderWidth: 0.5,
    marginHorizontal: 8,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#e6e6e6",
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
    borderRadius: 12,
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 10,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
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
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingLeft: 8,
    paddingVertical: 4,
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
