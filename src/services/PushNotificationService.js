import messaging from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

class PushNotificationService {
  async requestUserPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.warn('Error requesting android permission', error);
        return false;
      }
    } else {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        return enabled;
      } catch (error) {
        console.warn('Error requesting permission', error);
        return false;
      }
    }
  }

  async getFCMToken() {
    try {
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
      }
      const fcmToken = await messaging().getToken();
      return fcmToken;
    } catch (error) {
      console.warn('Error getting FCM token:', error);
      return null;
    }
  }

  listenToTokenRefresh(callback) {
    return messaging().onTokenRefresh(token => {
      console.log('FCM Token Refreshed:', token);
      if (callback) callback(token);
    });
  }

  setupForegroundListener() {
    return messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived in foreground!', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'Notifikasi Baru',
        remoteMessage.notification?.body || ''
      );
    });
  }

  async initialize() {
    const hasPermission = await this.requestUserPermission();
    if (hasPermission) {
      const token = await this.getFCMToken();
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission not granted');
      return null;
    }
  }
}

export default new PushNotificationService();
