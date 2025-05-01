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

const baseUrl = 'http://192.168.1.119:3000';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError]     = useState('');

  // Step 1: login default account
  const loginDefault = async () => {
    console.log('[ProfileScreen] loginDefault start');
    const res = await fetch(`${baseUrl}/auth/default`);
    if (!res.ok) throw new Error(`Default login failed: ${res.status}`);
    const { token, user } = await res.json();
    await AsyncStorage.setItem('token', token);
    console.log('[ProfileScreen] default token saved');
    return user;
  };

  // Step 2: fetch protected profile
  const fetchProtected = async () => {
    console.log('[ProfileScreen] fetchProtected start');
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No token stored');
    const res = await fetch(`${baseUrl}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Protected fetch failed ${res.status}: ${text}`);
    }
    return res.json();
  };

  // Combined flow
  const loadProfile = async () => {
    try {
      // Always get default first
      const defaultUser = await loginDefault();

      // Then try protected
      let realUser;
      try {
        realUser = await fetchProtected();
        console.log('[ProfileScreen] protected user:', realUser);
        setProfile(realUser);
      } catch (e) {
        console.warn('[ProfileScreen] protected fetch error, using default:', e);
        setProfile(defaultUser);
      }
    } catch (e) {
      console.error('[ProfileScreen] loadProfile error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
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
        <Button title="Try Again" onPress={() => {
          setError('');
          setLoading(true);
          loadProfile();
        }} />
      </View>
    );
  }

  // Render whichever user we ended up with
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {profile.username}!</Text>
      <Text style={styles.email}>{profile.email}</Text>
      <View style={styles.navRow}>
        <Button title="View Profile" onPress={() => navigation.navigate('ViewProfile')} />
        <Button title="Browse Matches" onPress={() => navigation.navigate('Swiping')} />
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