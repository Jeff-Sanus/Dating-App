import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import AuthOptionsScreen from './screens/AuthOptionsScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthOptions">

        {/* Screen for choosing between Signup and Login */}
        <Stack.Screen
          name="AuthOptions"
          component={AuthOptionsScreen}
          options={{ title: 'Welcome' }}
        />

        {/* Signup screen */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Sign Up' }}
        />

        {/* Login screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Log In' }}
        />

        {/* Protected profile screen */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Your Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
