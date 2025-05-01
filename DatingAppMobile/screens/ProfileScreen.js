// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [message, setMessage]           = useState('');
  const [error, setError]               = useState('');

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const res = await fetch('http://192.168.1.119:3000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server ${res.status}: ${text}`);
      }
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      console.error('fetchProfile error:', e);
      setError(e.message);
      Alert.alert('Error loading profile', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Pick image from library
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission required', 'Allow photo library access');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
      setMessage('');
    }
  };

  // Upload picked image and save to profile
  const uploadAndSave = async () => {
    if (!selectedImage) {
      Alert.alert('No image', 'Please select one first.');
      return;
    }
    setUploading(true);
    setMessage('');
    try {
      const token = await AsyncStorage.getItem('token');
      const { uri } = selectedImage;
      const name = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(name);
      const type = match ? `image/${match[1]}` : 'image';
      const formData = new FormData();

      if (Platform.OS === 'web') {
        const blobRes = await fetch(uri);
        const blob = await blobRes.blob();
        formData.append('profilePicture', blob, name);
      } else {
        formData.append('profilePicture', { uri, name, type });
      }

      // 1) Upload file
      const uploadRes = await fetch('http://192.168.1.119:3000/upload-profile-picture', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { profilePic } = await uploadRes.json();

      // 2) Save URL in profile
      const saveRes = await fetch('http://192.168.1.119:3000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profilePic }),
      });
      if (!saveRes.ok) throw new Error('Save failed');

      // 3) Refresh
      await fetchProfile();
      setSelectedImage(null);
      setMessage('Profile picture updated!');
    } catch (e) {
      console.error('uploadAndSave error:', e);
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
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', margin: 20 }}>Error: {error}</Text>
        <Button title="Try Again" onPress={() => {
          setError('');
          setLoading(true);
          fetchProfile();
        }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {profile.username}!</Text>
      <Text style={styles.sub}>{profile.email}</Text>

      {profile.profilePic
        ? <Image source={{ uri: profile.profilePic }} style={styles.avatar} />
        : <View style={[styles.avatar, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Photo</Text>
          </View>
      }

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

      {!!message && <Text style={styles.message}>{message}</Text>}

      <View style={styles.navButtons}>
        <Button title="View My Profile" onPress={() => navigation.navigate('ViewProfile')} />
        <Button title="Browse Matches" onPress={() => navigation.navigate('Swiping')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center:       { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  container:    { flex:1, alignItems:'center', padding:20, backgroundColor:'#fff' },
  header:       { fontSize:24, fontWeight:'bold', marginBottom:10 },
  sub:          { fontSize:16, color:'#666', marginBottom:20 },
  avatar:       { width:140, height:140, borderRadius:70, marginBottom:20 },
  placeholder:  { backgroundColor:'#eee', justifyContent:'center', alignItems:'center' },
  placeholderText:{ color:'#666' },
  button:       { backgroundColor:'#007bff', padding:12, borderRadius:8, marginVertical:10 },
  disabled:     { backgroundColor:'#aaa' },
  buttonText:   { color:'#fff', fontSize:16 },
  preview:      { width:120, height:120, borderRadius:60, marginVertical:10 },
  message:      { marginTop:10, color:'green' },
  navButtons:   { marginTop:30, width:'100%', flexDirection:'row', justifyContent:'space-around' },
});