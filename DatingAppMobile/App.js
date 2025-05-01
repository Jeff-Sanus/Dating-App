import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens
import AuthOptionsScreen from './screens/AuthOptionsScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthOptions">
        {/* Auth choice screen */}
        <Stack.Screen
          name="AuthOptions"
          component={AuthOptionsScreen}
          options={({ navigation }) => ({
            title: 'Welcome',
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate('Profile')}
                title="Profile"
                color="#007bff"
              />
            ),
          })}
        />

        {/* Signup screen */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={({ navigation }) => ({
            title: 'Sign Up',
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate('Profile')}
                title="Profile"
                color="#007bff"
              />
            ),
          })}
        />

        {/* Login screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={({ navigation }) => ({
            title: 'Log In',
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate('Profile')}
                title="Profile"
                color="#007bff"
              />
            ),
          })}
        />

        {/* Profile screen */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Your Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
