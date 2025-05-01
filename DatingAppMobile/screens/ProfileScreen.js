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

// Always point at your LAN IP:
const baseUrl = 'http://192.168.1.119:3000';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading]   = useState(true);
  const [profile, setProfile]   = useState(null);
  const [error, setError]       = useState('');

  // 1) Call /auth/default to get a token + user
  const loginDefault = async () => {
    console.log('[ProfileScreen] logging in default account');
    try {
      const res = await fetch(`${baseUrl}/auth/default`);
      if (!res.ok) throw new Error(`Default login failed: ${res.status}`);
      const { token, user } = await res.json();
      console.log('[ProfileScreen] default token:', token);
      await AsyncStorage.setItem('token', token);
      setProfile(user);
    } catch (e) {
      console.error('[ProfileScreen] default login error:', e);
      setError(e.message);
    }
  };

  // 2) Fetch protected profile if possible
  const fetchProfile = async () => {
    console.log('[ProfileScreen] fetching protected profile');
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('[ProfileScreen] no token, falling back to default');
        return loginDefault();
      }
      const res = await fetch(`${baseUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.warn('[ProfileScreen] protected fetch failed, status:', res.status);
        return loginDefault();
      }
      const data = await res.json();
      console.log('[ProfileScreen] protected profile data:', data);
      setProfile(data);
    } catch (e) {
      console.error('[ProfileScreen] fetchProfile error:', e);
      // on any error, fallback to default login
      await loginDefault();
    }
  };

  useEffect(() => {
    (async () => {
      await fetchProfile();
      setLoading(false);
    })();
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
        <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>
        <Button
          title="Try Again"
          onPress={() => {
            setError('');
            setLoading(true);
            fetchProfile().then(() => setLoading(false));
          }}
        />
      </View>
    );
  }

  // At this point, profile is guaranteed set (either protected or default)
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {profile.username}!</Text>
      <Text style={styles.email}>{profile.email}</Text>
      {/* Add avatar, upload button, etc. here */}
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
  center:   { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  container:{ flex:1, alignItems:'center', padding:20, backgroundColor:'#fff' },
  welcome:  { fontSize:24, fontWeight:'bold', marginBottom:10 },
  email:    { fontSize:16, color:'#666', marginBottom:20 },
  navRow:   { flexDirection:'row', justifyContent:'space-around', width:'100%' },
});