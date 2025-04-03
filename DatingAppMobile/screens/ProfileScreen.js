import React, { useState } from 'react';
import { View, Text, Image, Button, Alert, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImageSelector() {
  const [selectedImage, setSelectedImage] = useState(null);

  const selectImage = async () => {
    console.log("Select Image button pressed");
    if (Platform.OS !== 'web') {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Permission to access media library is required!');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images, 
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log('Selected image asset:', result.assets[0]);
      setSelectedImage(result.assets[0]);
    } else {
      console.log("Image selection was canceled.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={selectImage} />
      {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  selectedImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 20,
  },
});