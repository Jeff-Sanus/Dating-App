import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, Button, StyleSheet, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://192.168.1.119:3000';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError]     = useState('');

  const fetchProfile = async () => {
    setError('');
    console.log('[ProfileScreen] about to fetch:', `${baseUrl}/auth/profile`);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${baseUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('[ProfileScreen] response status:', res.status);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server ${res.status}: ${text}`);
      }
      const data = await res.json();
      console.log('[ProfileScreen] got JSON:', data);
      setProfile(data);
    } catch (e) {
      console.error('[ProfileScreen] fetchProfile error:', e);
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
        <Text>Loading profile…</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color:'red' }}>{error}</Text>
        <Button title="Retry" onPress={() => { setLoading(true); fetchProfile(); }} />
      </View>
    );
  }
  return (
    <View style={styles.center}>
      <Text style={styles.welcome}>Welcome, {profile.username}!</Text>
      <Text style={styles.email}>{profile.email}</Text>
      <View style={{ marginTop:20, width:'100%' }}>
        <Button title="View My Profile" onPress={() => navigation.navigate('ViewProfile')} />
        <View style={{ height:10 }}/>
        <Button title="Browse Matches" onPress={() => navigation.navigate('Swiping')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center:   { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  welcome:  { fontSize:24, fontWeight:'bold', marginBottom:10 },
  email:    { fontSize:16, color:'#666' },
});