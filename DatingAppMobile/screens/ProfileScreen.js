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
  const [profile, setProfile]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [message, setMessage]         = useState('');
  const [error, setError]             = useState('');

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
        throw new Error(`Server responded ${res.status}: ${text}`);
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

      {profile.profilePic ? (
        <Image source={{ uri: profile.profilePic }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Photo</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={async () => {
        // image pick/upload code unchanged...
      }}>
        <Text style={styles.buttonText}>Select & Upload New Photo</Text>
      </TouchableOpacity>

      <View style={styles.navButtons}>
        <Button title="View My Profile" onPress={() => navigation.navigate('ViewProfile')} />
        <Button title="Browse Matches" onPress={() => navigation.navigate('Swiping')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center:    { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  container: { flex:1, alignItems:'center', padding:20, backgroundColor:'#fff' },
  header:    { fontSize:24, fontWeight:'bold', marginBottom:10 },
  sub:       { fontSize:16, color:'#666', marginBottom:20 },
  avatar:    { width:140, height:140, borderRadius:70, marginBottom:20 },
  placeholder:{ backgroundColor:'#eee', justifyContent:'center', alignItems:'center' },
  placeholderText:{ color:'#666' },
  button:    { backgroundColor:'#007bff', padding:12, borderRadius:8 },
  buttonText:{ color:'#fff', fontSize:16 },
  navButtons:{ marginTop:30, width:'100%', flexDirection:'row', justifyContent:'space-around' },
});