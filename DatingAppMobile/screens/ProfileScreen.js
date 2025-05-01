import Constants from 'expo-constants';
import { Platform } from 'react-native';

// …

// Determine host for API calls:
const getApiBase = () => {
  // On Android emulator: use 10.0.2.2
  if (Platform.OS === 'android' && Constants.manifest.debuggerHost.includes('localhost')) {
    return 'http://10.0.2.2:3000';
  }
  // On any other case (iOS simulator, physical device, web):
  // grab the LAN IP from the debuggerHost (e.g. "192.168.1.119:8081")
  const host = Constants.manifest.debuggerHost.split(':').shift();
  return `http://${host}:3000`;
};

const baseUrl = getApiBase();