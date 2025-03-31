// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        // If you stored a token, retrieve it
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Example: fetch user profile
          const response = await fetch('http://localhost:3000/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Failed to fetch profile');
          const data = await response.json();
          setUsername(data.username || '');
        }
      } catch (error) {
        console.error('Profile load error:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {username}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24 }
});
