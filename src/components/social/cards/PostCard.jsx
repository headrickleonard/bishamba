import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { BlurView } from "expo-blur"; // or '@react-native-community/blur'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Earth,
  Heart,
  Share,
  Bookmark,
  AtSign,
  SmileIcon,
  GiftIcon,
  SendHorizontalIcon,
} from "lucide-react-native";
import EmojiSelector from "react-native-emoji-selector";

export default function PostCard() {
  const POST_IMAGE_URL =
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D";

  const PROFILE_PICTURE_URL =
    "https://plus.unsplash.com/premium_photo-1661508557554-e3d96f2fdde5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhdXRpZnVsJTIwZ2lybHxlbnwwfHwwfHx8MA%3D%3D";

  const refRBSheet = useRef();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([
    "Great post!",
    "Thanks for sharing.",
    "Amazing view!",
    "By removing the fixed height from RBSheet and ensuring that the content inside it is scrollable ",
    "Great post!",
    "Thanks for sharing.",
    "Amazing view!",
    "By removing the fixed height from RBSheet and ensuring that the content inside it is scrollable ",
    "Great post!",
    "Thanks for sharing.",
    "Amazing view!",
    "By removing the fixed height from RBSheet and ensuring that the content inside it is scrollable ",
  ]);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    setIsEmojiPickerVisible(false); // Close emoji picker after selection
    // You can use the selected emoji as needed (e.g., store it in state)
  };
  const handleSend = () => {
    if (message.trim()) {
      setComments([...comments, message.trim()]);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Travel in Georgia</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.profileContainer}>
            <View style={styles.profileInfo}>
              <Image
                source={{ uri: PROFILE_PICTURE_URL }}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.title}>Sarah Hyldan</Text>
                <View style={styles.liveStoryContainer}>
                  <Earth color={"pink"} size={12} />
                  <Text style={styles.liveStoryText}>Live story</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.followButton} onPress={() => {}}>
              <Text style={styles.followButtonText}>Following</Text>
            </TouchableOpacity>
          </View>
          <Image source={{ uri: POST_IMAGE_URL }} style={styles.postImage} />
          <Text style={styles.snippet}>
            If Georgia, the country features on... see more
          </Text>
          <View style={styles.footerContainer}>
            <Text style={styles.timeText}>Posted 2 hours ago</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <Heart color={"#ff69b4"} size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Share color={"#007bff"} size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Bookmark color={"#007bff"} size={24} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => {
              setSheetOpen(true);
              refRBSheet.current.open();
            }}
          >
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isSheetOpen && (
        <View style={StyleSheet.absoluteFill}>
          <BlurView intensity={10} style={StyleSheet.absoluteFill} />
          <Image
            source={require("../../../assets/images/textur.png")}
            style={styles.textureOverlay}
          />
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
          >
            <ScrollView style={styles.commentsContainer}>
              {comments.map((comment, index) => (
                <Text key={index} style={styles.comment}>
                  {comment}
                </Text>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <View style={styles.row}>
                <TouchableOpacity style={styles.profilePicture}>
                  <Image
                    source={{ uri: PROFILE_PICTURE_URL }}
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
      {/* <View classname="bg-green-500 h-12"> */}
      <EmojiSelector
        isVisible={isEmojiPickerVisible}
        onEmojiSelected={handleEmojiSelect}
        hide={() => setIsEmojiPickerVisible(false)}
      />
      {/* </View> */}
    </View>
  );
}

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
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
    borderRadius: 12,
    borderColor: "#e6e8e6",
    borderWidth: 0.5,
    marginHorizontal: 8,
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
  },
  followButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followButtonText: {
    color: "#fff",
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
    backgroundColor: "#007bff",
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
    opacity: 0.3, // Adjust the opacity to your liking
  },
});
