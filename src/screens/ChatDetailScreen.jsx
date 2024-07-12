import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { createTable, getMessages, insertMessage } from "../db/database";
import ScreenWrapper from "../components/shared/ScreenWrapper";
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

// const messages = [
//   { id: '1', text: '941', sender: 'receiver', profilePicture: 'https://i.pravatar.cc/300?img=1', timestamp: '10:00 AM' },
//   { id: '2', text: 'il T -', sender: 'receiver', profilePicture: 'https://i.pravatar.cc/300?img=1', timestamp: '10:01 AM' },
//   { id: '3', text: 'No. 1 did not get it', sender: 'receiver', profilePicture: 'https://i.pravatar.cc/300?img=1', timestamp: '10:02 AM' },
//   { id: '4', text: 'Ok, I will just send it here.', sender: 'sender', profilePicture: 'https://i.pravatar.cc/300?img=2', timestamp: '10:03 AM' },
//   { id: '5', text: 'for adding this image in the landing page', sender: 'sender', profilePicture: 'https://i.pravatar.cc/300?img=2', timestamp: '10:04 AM' },
//   { id: '6', text: '00 db #', sender: 'receiver', profilePicture: 'https://i.pravatar.cc/300?img=1', timestamp: '10:05 AM' },
//   { id: '7', text: 'Ok, should I send you a preview of the updated design', sender: 'sender', profilePicture: 'https://i.pravatar.cc/300?img=2', timestamp: '10:06 AM' },
//   { id: '8', text: 'Tedoy', sender: 'receiver', profilePicture: 'https://i.pravatar.cc/300?img=1', timestamp: '10:07 AM' },
// ];

const ChatDetailScreen = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    createTable();
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    getMessages((msgs) => {
      setMessages(msgs);
    });
  };

  const sendMessage = (imageUri = null) => {
    const newMessage = {
      text: message,
      sender: "sender",
      timestamp: new Date().toISOString(),
      image: imageUri,
    };
    insertMessage(
      newMessage.text,
      newMessage.sender,
      newMessage.timestamp,
      newMessage.image
    );
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      sendMessage(selectedImage);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.messagesContainer}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.sender === "sender"
                  ? styles.senderWrapper
                  : styles.receiverWrapper,
              ]}
            >
              {message.sender === "receiver" && message.profilePicture && (
                <Image
                  source={{ uri: message.profilePicture }}
                  style={styles.profilePicture}
                />
              )}
              <View
                style={[
                  styles.messageContainer,
                  message.sender === "sender" ? styles.sender : styles.receiver,
                ]}
              >
                {message.image ? (
                  <Image
                    source={{ uri: message.image }}
                    style={styles.messageImage}
                  />
                ) : (
                  <Text style={styles.text}>{message.text}</Text>
                )}
                <Text style={styles.timestamp}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              {message.sender === "sender" && message.profilePicture && (
                <Image
                  source={{ uri: message.profilePicture }}
                  style={styles.profilePicture}
                />
              )}
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
          />
          <TouchableOpacity onPress={() => sendMessage()}>
            <Ionicons name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {/* <View style={styles.inputWrapper}>
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
              <TouchableOpacity style={styles.iconButton} onPress={handleSend}>
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
        </View> */}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 20,
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 5,
  },
  senderWrapper: {
    justifyContent: "flex-end",
  },
  receiverWrapper: {
    justifyContent: "flex-start",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  sender: {
    backgroundColor: "#DCF8C6", // Light green background for sender
    alignSelf: "flex-end",
  },
  receiver: {
    backgroundColor: "#ECECEC", // Light gray background for receiver
    alignSelf: "flex-start",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    padding: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 60,
    marginHorizontal: 10,
  },
});

export default ChatDetailScreen;
