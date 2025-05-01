// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'https://c76e-2600-1700-9460-df60-d4c3-6917-f937-169a.ngrok-free.app/auth/profile';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError]     = useState('');

  const fetchProfile = async () => {
    setError('');
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No auth token, please log in again.');

      const url = `${baseUrl}/auth/profile`;
      console.log('[ProfileScreen] fetching protected profile from:', url);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      console.log('[ProfileScreen] response status:', res.status);

      // If not 2xx, read out the error body:
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server ${res.status}: ${errText}`);
      }

      // parse JSON
      const data = await res.json();
      console.log('[ProfileScreen] got profile JSON:', data);
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
        <Text style={{ color:'red', marginBottom:20 }}>{error}</Text>
        <Button title="Try Again" onPress={fetchProfile} />
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
  center:  { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  welcome: { fontSize:24, fontWeight:'bold', marginBottom:10 },
  email:   { fontSize:16, color:'#666' },
});