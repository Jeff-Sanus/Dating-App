// screens/AuthOptionsScreen.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function AuthOptionsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('Register')}
      />
      <View style={{ height: 20 }} />
      <Button
        title="Log In"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});