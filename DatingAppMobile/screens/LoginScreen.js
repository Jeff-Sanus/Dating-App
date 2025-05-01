// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [message, setMessage] = useState('');

  const loginDefault = async () => {
    setMessage('');
    try {
      const res = await fetch('http://192.168.1.119:3000/auth/default');
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      await AsyncStorage.setItem('token', data.token);
      setMessage('Logged in!');
      navigation.replace('Profile');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Login with Default Account" onPress={loginDefault} />
      {message ? <Text style={styles.msg}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  msg: { marginTop: 20, textAlign: 'center', color: 'green' },
});