import React, { useEffect, useState } from 'react';
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
      <Stack.Navigator initialRouteName="Register">

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

        {/* Make sure this exactly matches the name you navigate to */}
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

        <Stack.Screen
          name="EditBio"
          component={EditBioScreen}
          options={{ title: 'Edit Bio' }}
        />

        <Stack.Screen
          name="Swiping"
          component={SwipingScreen}
          options={{ title: 'Browse Matches' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
