// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Button, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch profile data when the component mounts
  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in.');
        const response = await fetch('http://192.168.1.119:3000/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
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

  // Function to select an image
  const selectImage = async () => {
    console.log("Select Image button pressed");
    // On non-web platforms, request permission to access media library
    if (Platform.OS !== 'web') {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission required', 'Permission to access media library is required!');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use Images option exclusively
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
            <Image source={{ uri: profile.profilePic }} style={styles.profileImage} />
          ) : (
            <Text>No profile picture available.</Text>
          )}
          <View style={styles.uploadSection}>
            <Text style={styles.sectionHeader}>Select a Profile Picture</Text>
            <Button title="Select Image" onPress={selectImage} />
            {selectedImage && (
              <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
            )}
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
    padding: 20,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  header: { 
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: { 
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#007bff',
    marginBottom: 20,
  },
  uploadSection: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  selectedImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 10,
  },
});