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

// Your LAN IP:
const baseUrl = 'http://192.168.1.119:3000';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError]     = useState('');

  // Always login default user for now
  const loginDefault = async () => {
    try {
      console.log('[ProfileScreen] logging in default account');
      const res = await fetch(`${baseUrl}/auth/default`);
      if (!res.ok) throw new Error(`Default login failed: ${res.status}`);
      const { token, user } = await res.json();
      await AsyncStorage.setItem('token', token);
      setProfile(user);
    } catch (e) {
      console.error('[ProfileScreen] default login error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loginDefault();
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
            loginDefault();
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