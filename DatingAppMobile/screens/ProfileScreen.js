// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Button, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in.');

        const response = await fetch('http://192.168.1.119:3000/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response from server:', errorData);
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const selectImage = async () => {
    console.log("Select Image button pressed");
    if (Platform.OS !== 'web') {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Permission to access the media library is required!");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    // Check for the new API response
    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log('Selected image asset:', result.assets[0]);
      setSelectedImage(result.assets[0]);
    } else {
      console.log("Image selection was canceled.");
    }
  };

  const uploadImage = async () => {
    console.log("Upload Image button pressed");
    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please select an image first.');
      return;
    }
    setUploadLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in.');

      const localUri = selectedImage.uri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('profilePicture', {
        uri: localUri,
        name: filename,
        type,
      });

      const response = await fetch('http://192.168.1.119:3000/upload-profile-picture', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error uploading image:', errorData);
        setUploadMessage('Error uploading profile picture.');
      } else {
        setUploadMessage('Profile picture uploaded successfully!');
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Upload image error:', error);
      setUploadMessage('Error uploading profile picture.');
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profile ? (
        <>
          <Text style={styles.header}>Welcome, {profile.username}!</Text>
          <Text style={styles.email}>{profile.email}</Text>
          {profile.profilePic ? (
            <Image
              source={{ uri: profile.profilePic }}
              style={styles.profileImage}
            />
          ) : (
            <Text>No profile picture available.</Text>
          )}

          <View style={styles.uploadSection}>
            <Text style={styles.sectionHeader}>Update Profile Picture</Text>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.selectedImage}
              />
            )}
            <Button title="Select Image" onPress={selectImage} />
            <View style={{ marginVertical: 10 }} />
            <Button title="Upload Picture" onPress={uploadImage} disabled={uploadLoading} />
            {uploadLoading && <ActivityIndicator size="small" color="#007bff" />}
            {uploadMessage !== '' && <Text style={styles.uploadMessage}>{uploadMessage}</Text>}
          </View>
        </>
      ) : (
        <Text>No profile data found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    padding: 20
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  email: { 
    fontSize: 16, 
    color: '#666',
    marginBottom: 20
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#007bff',
    marginBottom: 20
  },
  uploadSection: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10
  },
  selectedImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  uploadMessage: {
    marginTop: 10,
    fontSize: 14,
    color: '#007bff'
  }
});