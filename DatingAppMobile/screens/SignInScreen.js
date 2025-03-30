import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://192.168.1.119:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('✅ Logged in:', data.token);
        
        await AsyncStorage.setItem('token', data.token); // Save token
  
        Toast.show({
          type: 'success',
          text1: 'Login successful!',
          position: 'bottom'
        });
  
        // Navigate to ProfileScreen (next step)
        navigation.navigate('Profile');
  
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: data.error,
          position: 'bottom'
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network error',
        text2: err.message,
        position: 'bottom'
      });
    }
  };

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Logged in:', data.token);
        // Store token and navigate, etc.
      } else {
        console.warn('❌ Login failed:', data.error);
      }
    } catch (err) {
      console.error('⚠️ Network error:', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Sign In</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSignIn} style={styles.button}>
        Sign In
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    marginBottom: 16
  },
  button: {
    marginTop: 10,
    paddingVertical: 5
  }
});