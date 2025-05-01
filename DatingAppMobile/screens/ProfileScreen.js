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
        if (!res.ok) throw new Error('Failed to load profile');
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
    if (Platform.OS !== 'web') {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission required', 'Allow photo access to update your profile pic.');
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

  // Upload picked image
  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('No image', 'Please select an image first.');
      return;
    }
    setUploading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const uri      = selectedImage.uri;
      const name     = uri.split('/').pop();
      const match    = /\.(\w+)$/.exec(name);
      const type     = match ? `image/${match[1]}` : 'image';
      const formData = new FormData();
      formData.append('profilePicture', { uri, name, type });

      const res = await fetch('http://192.168.1.119:3000/upload-profile-picture', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      const data = await res.json();
      setProfile(prev => ({ ...prev, profilePic: data.profilePic }));
      setSelectedImage(null);
      setMessage('Profile picture updated!');
    } catch (e) {
      Alert.alert('Upload Error', e.message);
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
          <Text style={styles.header}>{profile.username}</Text>
          <Text style={styles.email}>{profile.email}</Text>

          {profile.profilePic ? (
            <Image source={{ uri: profile.profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholder]}>
              <Text style={{ color: '#666' }}>No Photo</Text>
            </View>
          )}

          <View style={styles.buttons}>
            <Button title="Select New Photo" onPress={selectImage} />
          </View>

          {selectedImage && (
            <>
              <Image source={{ uri: selectedImage.uri }} style={styles.avatarPreview} />
              <View style={styles.buttons}>
                <Button
                  title={uploading ? 'Uploading...' : 'Upload Photo'}
                  onPress={uploadImage}
                  disabled={uploading}
                />
              </View>
            </>
          )}

          {message ? <Text style={styles.message}>{message}</Text> : null}
        </>
      ) : (
        <Text style={styles.message}>No profile data.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#007bff',
    marginBottom: 20,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 10,
    marginBottom: 10,
  },
  buttons: {
    marginVertical: 10,
    width: '80%',
  },
  message: {
    marginTop: 10,
    color: 'green',
  },
});