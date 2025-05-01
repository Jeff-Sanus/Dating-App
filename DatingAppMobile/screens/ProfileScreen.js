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

const baseUrl = 'http://192.168.1.119:3000';

// Simple timeout for any fetch
const fetchWithTimeout = (url, opts = {}, timeout = 8000) =>
  Promise.race([
    fetch(url, opts),
    new Promise((_, rej) =>
      setTimeout(() => rej(new Error('Request timed out')), timeout)
    ),
  ]);

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError]     = useState('');

  const loginDefault = async () => {
    console.log('[ProfileScreen] loginDefault start');
    try {
      console.log('[ProfileScreen] fetching /auth/default');
      const res = await fetchWithTimeout(`${baseUrl}/auth/default`, {}, 8000);
      console.log('[ProfileScreen] default-login responded:', res.status);

      if (!res.ok) {
        const txt = await res.text();
        console.log('[ProfileScreen] default-login error body:', txt);
        throw new Error(`Default login failed: ${res.status}`);
      }

      console.log('[ProfileScreen] default-login OK, parsing JSON');
      const { token, user } = await res.json();
      console.log(
        '[ProfileScreen] default-login JSON:',
        { token: token.slice(0, 10) + '…', username: user.username }
      );

      await AsyncStorage.setItem('token', token);
      console.log('[ProfileScreen] default token saved');

      return user;
    } catch (e) {
      console.error('[ProfileScreen] loginDefault error:', e);
      throw e;
    }
  };

  const loadProfile = async () => {
    try {
      const defaultUser = await loginDefault();
      setProfile(defaultUser);
    } catch (e) {
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
        <Button
          title="Try Again"
          onPress={() => {
            setError('');
            setLoading(true);
            loadProfile();
          }}
        />
      </View>
    );
  }

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