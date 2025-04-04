// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    console.log('[RegisterScreen] handleRegister triggered');
    try {
      console.log('[RegisterScreen] Registering with:', { username, email, password });
      const response = await fetch('http://192.168.1.119:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      
      console.log('[RegisterScreen] Fetch response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[RegisterScreen] Error response:', errorData);
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      console.log('[RegisterScreen] Response data:', data);
      
      if (data.token) {
        console.log('[RegisterScreen] Received token:', data.token);
        await AsyncStorage.setItem('token', data.token);
        const storedToken = await AsyncStorage.getItem('token');
        console.log('[RegisterScreen] Token saved:', storedToken);
      } else {
        console.warn('[RegisterScreen] No token received; proceeding to navigate for testing purposes');
      }
      
      console.log('[RegisterScreen] Navigating to Profile');
      navigation.navigate('Profile');
      console.log('[RegisterScreen] Navigation called');
    } catch (error) {
      console.error('[RegisterScreen] Error during registration:', error);
      Alert.alert('Registration Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Registering...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center' 
  },
  header: { 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  input: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 5
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16 
  }
});