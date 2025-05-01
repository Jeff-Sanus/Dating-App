// screens/EditBioScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditBioScreen({ navigation }) {
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing bio
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch('http://192.168.1.119:3000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBio(data.bio || '');
      } catch (e) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Save bio
  const saveBio = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://192.168.1.119:3000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio }),
      });
      if (!res.ok) throw new Error('Failed to save bio');
      Alert.alert('Saved', 'Your bio has been updated.');
      navigation.navigate('ViewProfile');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write a short bio..."
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <Button
        title={saving ? 'Saving...' : 'Save Bio'}
        onPress={saveBio}
        disabled={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center:    { flex: 1, justifyContent: 'center' },
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input:     {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
});