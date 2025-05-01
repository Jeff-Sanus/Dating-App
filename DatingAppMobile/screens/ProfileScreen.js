// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hard-coded LAN URL; remove any other baseUrl logic
const baseUrl = 'https://c76e-2600-1700-9460-df60-d4c3-6917-f937-169a.ngrok-free.app';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError]     = useState('');

  const fetchProfile = async () => {
    console.log('[ProfileScreen] fetchProfile start');
    try {
      // 1) Get token
      const token = await AsyncStorage.getItem('token');
      console.log('[ProfileScreen] token:', token?.slice(0,10) + '…');
      if (!token) throw new Error('No JWT token in storage');

      // 2) Kick off the fetch
      console.log('[ProfileScreen] about to fetch:', `${baseUrl}/auth/profile`);
      const res = await fetch(`${baseUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3) Log status
      console.log('[ProfileScreen] response status:', res.status);

      // 4) Error if not OK
      if (!res.ok) {
        const body = await res.text();
        console.log('[ProfileScreen] error body:', body);
        throw new Error(`Server responded ${res.status}`);
      }

      // 5) Parse JSON
      const data = await res.json();
      console.log('[ProfileScreen] parsed JSON:', data);

      // 6) Set into state
      setProfile(data);
    } catch (e) {
      console.error('[ProfileScreen] fetchProfile error:', e);
      setError(e.message);
    } finally {
      console.log('[ProfileScreen] fetchProfile end – loading false');
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
        <Text>Loading profile…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>
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

  // If we reach here, profile is non-null
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {profile.username}!</Text>
      <Text style={styles.email}>{profile.email}</Text>
      <View style={styles.navRow}>
        <Button
          title="View Profile"
          onPress={() => navigation.navigate('ViewProfile')}
        />
        <Button
          title="Swipe"
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