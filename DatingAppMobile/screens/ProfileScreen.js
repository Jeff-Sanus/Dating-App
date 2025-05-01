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

// Point at your machine’s LAN IP:
const baseUrl = 'http://192.168.1.119:3000';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError]     = useState('');

  const fetchProfile = async () => {
    console.log('[ProfileScreen] fetchProfile start');
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('[ProfileScreen] token:', token);
      if (!token) throw new Error('No token in storage');

      // 1) Ping root
      console.log('[ProfileScreen] pinging root:', `${baseUrl}/`);
      const pingRes = await fetch(`${baseUrl}/`);
      console.log('[ProfileScreen] ping status:', pingRes.status);

      // 2) Fetch profile without timeout
      console.log('[ProfileScreen] about to fetch from:', `${baseUrl}/auth/profile`);
      const res = await fetch(`${baseUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[ProfileScreen] response status:', res.status);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server ${res.status}: ${errText}`);
      }

      const data = await res.json();
      console.log('[ProfileScreen] profile data:', data);
      setProfile(data);
    } catch (e) {
      console.error('[ProfileScreen] fetchProfile error:', e);
      setError(e.message);
    } finally {
      console.log('[ProfileScreen] fetchProfile end (loading false)');
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
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {profile.username}!</Text>
      <Text style={styles.email}>{profile.email}</Text>

      <View style={styles.navRow}>
        <Button
          title="View Full Profile"
          onPress={() => navigation.navigate('ViewProfile')}
        />
        <Button
          title="Browse Matches"
          onPress={() => navigation.navigate('Swiping')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center:   { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  container:{ flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  welcome:  { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  email:    { fontSize: 16, color: '#666', marginBottom: 20 },
  navRow:   { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
});