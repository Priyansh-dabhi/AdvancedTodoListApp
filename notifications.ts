import { getMessaging, requestPermission, getToken, AuthorizationStatus } from '@react-native-firebase/messaging';

// Request notification permissions (required for iOS)
export async function requestUserPermission() {
  const authStatus = await requestPermission(getMessaging());
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  return enabled;
}

// Get the FCM device token
export async function getFCMToken() {
  try {
    const token = await getToken(getMessaging());
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}