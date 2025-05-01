// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, Button, StyleSheet, Platform, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://192.168.1.119:3000';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading]   = useState(true);
  const [profile, setProfile]   = useState(null);
  const [error, setError]       = useState('');

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${baseUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
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
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  // Guard: if there's an error or profile is null, show retry
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

  // Now profile is guaranteed non-null
  return (
    <View style={styles.center}>
      <Text>Welcome, {profile.username}!</Text>
      {/* …etc. */}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' }
});