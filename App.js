import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/Navigation/Navigation';
import PushNotificationService from './src/services/PushNotificationService';

export default function App() {
  useEffect(() => {
    // Initialize notifications (request permission and get/log FCM token)
    PushNotificationService.initialize();

    // Listen to FCM Token refresh
    const unsubscribeTokenRefresh = PushNotificationService.listenToTokenRefresh(token => {
      // You can add logic here to sync the new token to your server if the user is authenticated
    });

    // Setup listener for notifications received while the app is in the foreground
    const unsubscribeForeground = PushNotificationService.setupForegroundListener();

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeForeground();
    };
  }, []);

  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}