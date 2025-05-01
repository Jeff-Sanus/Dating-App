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

  // Choose correct host based on platform
  const baseUrl = Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://192.168.1.119:3000';

  // Fetch user profile
  const fetchProfile = async () => {
    console.log('[ProfileScreen] fetchProfile start');
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found in storage');
      const res = await fetch(`${baseUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[ProfileScreen] response status:', res.status);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server ${res.status}: ${text}`);
      }
      const data = await res.json();
      console.log('[ProfileScreen] profile data:', data);
      setProfile(data);
    } catch (e) {
      console.error('[ProfileScreen] fetch error:', e);
      setError(e.message);
      Alert.alert('Error loading profile', e.message);
    } finally {
      setLoading(false);
      console.log('[ProfileScreen] fetchProfile end (loading false)');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
        <Text style={{ color: 'red', margin: 20 }}>{error}</Text>
        <Button
          title="Try Again"
          onPress={() => {
            setError('');
            setLoading(true);
            fetchProfile();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {profile.username}!</Text>
      <Text style={styles.sub}>{profile.email}</Text>

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

      {/* ...rest of your UI... */}
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
  button:       { backgroundColor:'#007bff', padding:12, borderRadius:8 },
  buttonText:   { color:'#fff', fontSize:16 },
});