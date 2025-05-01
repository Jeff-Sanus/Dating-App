// App.js
import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen    from './screens/RegisterScreen';
import LoginScreen       from './screens/LoginScreen';
import ProfileScreen     from './screens/ProfileScreen';
import ViewProfileScreen from './screens/ViewProfileScreen';
import EditBioScreen     from './screens/EditBioScreen';
import SwipingScreen     from './screens/SwipingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        {/* LOGIN SCREEN: header button to go to SIGN UP */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={({ navigation }) => ({
            title: 'Log In',
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate('Register')}
                title="Sign Up"
                color="#007bff"
              />
            ),
          })}
        />

        {/* REGISTER SCREEN: header button to go back to LOGIN */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={({ navigation }) => ({
            title: 'Sign Up',
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate('Login')}
                title="Log In"
                color="#007bff"
              />
            ),
          })}
        />

        {/* PROFILE EDIT SCREEN */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ navigation }) => ({
            title: 'Edit Profile',
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate('ViewProfile')}
                title="View"
                color="#007bff"
              />
            ),
          })}
        />

        {/* READ-ONLY PROFILE SCREEN */}
        <Stack.Screen
          name="ViewProfile"
          component={ViewProfileScreen}
          options={({ navigation }) => ({
            title: 'My Profile',
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate('EditBio')}
                title="Edit"
                color="#007bff"
              />
            ),
          })}
        />

        {/* BIO EDIT SCREEN */}
        <Stack.Screen
          name="EditBio"
          component={EditBioScreen}
          options={{ title: 'Edit Bio' }}
        />

        {/* SWIPING SCREEN */}
        <Stack.Screen
          name="Swiping"
          component={SwipingScreen}
          options={{ title: 'Browse Matches' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}