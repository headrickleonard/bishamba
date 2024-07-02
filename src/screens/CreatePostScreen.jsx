import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CreatePostScreen = ({ navigation, route }) => {
  const [postType, setPostType] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    const newPost = {
      id: Math.random().toString(),
      username: 'Current User', // Replace with actual current user data
      userImage: 'https://example.com/currentuser.jpg', // Replace with actual user image
      content: textContent,
      image: postType === 'image' ? image : null,
    };

    if (route.params && route.params.addPost) {
      route.params.addPost(newPost);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {!postType ? (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionText}>What type of post would you like to create?</Text>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setPostType('text')}
          >
            <Text style={styles.buttonText}>Plain Text</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setPostType('image')}
          >
            <Text style={styles.buttonText}>Image with Text</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.inputContainer}>
          {postType === 'image' && (
            <>
              <Button title="Pick an image" onPress={pickImage} />
              {image && <Image source={{ uri: image }} style={styles.image} />}
            </>
          )}
          <TextInput
            placeholder="What's on your mind?"
            style={styles.input}
            value={textContent}
            onChangeText={setTextContent}
            multiline
          />
          <Button title="Post" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  selectionContainer: {
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 18,
    marginBottom: 20,
  },
  selectionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 100,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default CreatePostScreen;
