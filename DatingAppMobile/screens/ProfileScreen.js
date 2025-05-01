// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Always point at your computer’s LAN IP and port:
const baseUrl = 'http://192.168.1.119:3000';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError]     = useState('');

  console.log('[ProfileScreen] fetchProfile start');
  // Fetch profile data from the server
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token in storage');
      const res = await fetch(`${baseUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // grab server’s error message if any
        const errText = await res.text();
        throw new Error(`Server ${res.status}: ${errText}`);
      }
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      console.error('fetchProfile error:', e);
      setError(e.message);
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

  // If fetch failed or profile is still null
  if (error || !profile) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', marginBottom: 20 }}>
          {error || 'Unable to load profile.'}
        </Text>
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

  // Successful load
  return (
    <View style={styles.center}>
      <Text style={styles.welcome}>Welcome, {profile.username}!</Text>
      <Text style={styles.email}>{profile.email}</Text>
      {/* Add your avatar, buttons, etc. below */}
    </View>
  );
}

const styles = StyleSheet.create({
  center:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  welcome: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  email:   { fontSize: 16, color: '#666' },
});