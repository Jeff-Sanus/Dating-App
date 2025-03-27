import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
        console.log('📲 Register button pressed!');
      const response = await fetch('http://192.168.1.119:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Login successful! Token:', data.token);
        // TODO: Save token with AsyncStorage or navigate to the next screen
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
        keyboardType="email-address"
        autoCapitalize="none"
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
