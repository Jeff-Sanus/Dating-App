// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://192.168.1.119:3000/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
      }
      const { token } = await res.json();
      await AsyncStorage.setItem('token', token);
      navigation.replace('Profile');
    } catch (e) {
      Alert.alert('Login Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        title={loading ? 'Logging in…' : 'Log In'}
        onPress={handleLogin}
        disabled={loading}
      />

      <TouchableOpacity
        style={styles.signupLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.signupButton}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex:1, padding:20, justifyContent:'center', backgroundColor:'#fff' },
  title:      { fontSize:24, fontWeight:'bold', textAlign:'center', marginBottom:20 },
  input:      {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:5,
    padding:10,
    marginBottom:15
  },
  signupLink: { marginTop:20, alignItems:'center' },
  signupText: { color: '#555' },
  signupButton: { color: '#007bff', fontWeight: 'bold' }
});