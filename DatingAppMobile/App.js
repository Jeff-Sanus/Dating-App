import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen    from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen  from './screens/ProfileScreen';
// … other screens …

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      setInitialRoute(token ? 'Profile' : 'Login');
    })();
  }, []);

  if (!initialRoute) return null; // or a splash

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login"    component={LoginScreen}    options={{ title: 'Log In' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="Profile"  component={ProfileScreen}  options={{ title: 'My Profile' }} />
        {/* …other screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}