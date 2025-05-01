// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // load profile
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Not logged in');
        const res = await fetch('http://192.168.1.119:3000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Cannot fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (e) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission required', 'Allow photo access to update your picture.');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
      setMessage('');
    }
  };

  const uploadAndSave = async () => {
    if (!selectedImage) {
      Alert.alert('No image', 'Please select an image first.');
      return;
    }
    setUploading(true);
    setMessage('');
    try {
      const token = await AsyncStorage.getItem('token');
      const uri = selectedImage.uri;
      const name = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(name);
      const type = match ? `image/${match[1]}` : 'image';
      const formData = new FormData();
      formData.append('profilePicture', { uri, name, type });

      // 1. upload file
      const uploadRes = await fetch('http://192.168.1.119:3000/upload-profile-picture', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { profilePic } = await uploadRes.json();

      // 2. save URL in user profile
      const saveRes = await fetch('http://192.168.1.119:3000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ profilePic }),
      });
      if (!saveRes.ok) throw new Error('Saving profile picture failed');
      const updated = await saveRes.json();

      setProfile(updated.user || updated);
      setSelectedImage(null);
      setMessage('Profile picture updated!');
    } catch (e) {
      Alert.alert('Error', e.message);
      setMessage(e.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {profile.username}!</Text>
      <Text style={styles.email}>{profile.email}</Text>

      {profile.profilePic ? (
        <Image source={{ uri: profile.profilePic }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Photo</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Select New Photo</Text>
      </TouchableOpacity>

      {selectedImage && (
        <>
          <Image source={{ uri: selectedImage.uri }} style={styles.preview} />
          <TouchableOpacity
            style={[styles.button, uploading && styles.disabled]}
            onPress={uploadAndSave}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>
              {uploading ? 'Uploading...' : 'Upload & Save'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  email: { fontSize: 16, color: '#666', marginBottom: 20 },
  avatar: { width: 140, height: 140, borderRadius: 70, marginBottom: 20 },
  placeholder: { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#666' },
  button: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, marginVertical: 10 },
  disabled: { backgroundColor: '#aaa' },
  buttonText: { color: '#fff', fontSize: 16 },
  preview: { width: 120, height: 120, borderRadius: 60, marginVertical: 10 },
  message: { marginTop: 10, color: 'green' },
});
