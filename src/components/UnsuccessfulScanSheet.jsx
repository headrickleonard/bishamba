import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

const UnsuccessfulScanSheet = ({ photoUri, onSubmit, onClose }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit(description);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Unsuccessful</Text>
      <Text style={styles.subtitle}>Let the community help you identify this plant</Text>
      <Image source={{ uri: photoUri }} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Describe the plant and your concerns..."
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Post to Community</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#32c759',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UnsuccessfulScanSheet;