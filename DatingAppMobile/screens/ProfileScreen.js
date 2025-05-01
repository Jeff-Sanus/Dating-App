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
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [profile, setProfile]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [message, setMessage]           = useState('');

  // Fetch profile on mount
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token, please log in.');
        const res = await fetch('http://192.168.1.119:3000/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
        setProfile(await res.json());
      } catch (e) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Pick an image
  const selectImage = async () => {
    // same as before...
  };

  // Upload picked image
  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('No image', 'Please select an image first.');
      return;
    }
    setUploading(true);
    setMessage('');
    try {
      const token = await AsyncStorage.getItem('token');
      const uri      = selectedImage.uri;
      const name     = uri.split('/').pop();
      const match    = /\.(\w+)$/.exec(name);
      const type     = match ? `image/${match[1]}` : 'image';

      const formData = new FormData();
      formData.append('profilePicture', { uri, name, type });

      console.log('Uploading to:', 'http://192.168.1.119:3000/upload-profile-picture');
      console.log('FormData keys:', formData._parts || formData);

      const res = await fetch('http://192.168.1.119:3000/upload-profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // **DON'T** set Content-Type — let fetch fill in the boundary
        },
        body: formData,
      });
      console.log('Upload response status:', res.status);
      const text = await res.text();
      try { 
        const data = JSON.parse(text);
        setProfile(prev => ({ ...prev, profilePic: data.profilePic }));
        setSelectedImage(null);
        setMessage('Profile picture updated!');
      } catch {
        throw new Error(`Unexpected response: ${text}`);
      }
    } catch (e) {
      console.error('Upload error:', e);
      Alert.alert('Upload Error', e.message);
      setMessage(`Upload failed: ${e.message}`);
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
      {profile ? (
        <>
          {/* ... username / email / existing pic ... */}

          <Button title="Select New Photo" onPress={selectImage} />

          {selectedImage && (
            <>
              <Image source={{ uri: selectedImage.uri }} style={styles.preview} />
              <Button
                title={uploading ? 'Uploading…' : 'Upload Photo'}
                onPress={uploadImage}
                disabled={uploading}
              />
            </>
          )}

          {!!message && <Text style={styles.message}>{message}</Text>}
        </>
      ) : (
        <Text style={styles.message}>No profile data.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  preview: { width: 120, height: 120, borderRadius: 60, marginVertical: 10 },
  message: { marginTop: 10, color: 'green', textAlign: 'center' },
});