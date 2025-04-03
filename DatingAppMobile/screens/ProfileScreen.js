// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  Image, 
  StyleSheet, 
  Button, 
  Alert, 
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch profile data using token from AsyncStorage
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found. Please login with default account.');
      const response = await fetch('http://192.168.1.119:3000/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // On component mount, attempt to fetch profile (if token is stored)
  useEffect(() => {
    fetchProfile();
  }, []);

  // Login with default account: hits /auth/default endpoint to get a token and user data.
  const loginDefault = async () => {
    try {
      const response = await fetch('http://192.168.1.119:3000/auth/default', {
        method: 'GET'
      });
      if (!response.ok) throw new Error('Failed to login with default account');
      const data = await response.json();
      // Assume data contains a token and user info. Adjust as needed.
      await AsyncStorage.setItem('token', data.token);
      // You may need to update this based on your backend response:
      setProfile(data.user || data);
      Alert.alert('Success', 'Logged in with default account.');
    } catch (error) {
      console.error('Error logging in with default account:', error);
      Alert.alert('Error', 'Unable to login with default account.');
    }
  };

  // Function to select an image from the device gallery
  const selectImage = async () => {
    console.log("Select Image button pressed");
    if (Platform.OS !== 'web') {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission required', 'Permission to access media library is required!');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      {!profile && (
        // If no profile is loaded, show a button to login with the default account.
        <Button title="Login with Default Account" onPress={loginDefault} />
      )}
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
        <Text>Please login with the default account to view your profile.</Text>
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