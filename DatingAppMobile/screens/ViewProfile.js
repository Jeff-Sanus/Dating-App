// screens/ViewProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Not logged in');
      const res = await fetch('http://192.168.1.119:3000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      Alert.alert('Error', e.message);
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profile ? (
        <>
          {profile.profilePic ? (
            <Image source={{ uri: profile.profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholder]}>
              <Text style={styles.placeholderText}>No Photo</Text>
            </View>
          )}
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          {profile.bio ? (
            <Text style={styles.bio}>{profile.bio}</Text>
          ) : (
            <Text style={styles.bioPlaceholder}>No bio set</Text>
          )}
          <Button title="Edit Profile" onPress={() => navigation.navigate('Profile')} />
        </>
      ) : (
        <Text>No profile data available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container:  { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  avatar:     { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  placeholder:{ backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  placeholderText:{ color: '#666' },
  username:   { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  email:      { fontSize: 16, color: '#666', marginBottom: 15 },
  bio:        { fontSize: 14, textAlign: 'center', marginHorizontal: 20, marginBottom: 20 },
  bioPlaceholder:{ fontSize: 14, color: '#999', marginBottom: 20 },
});