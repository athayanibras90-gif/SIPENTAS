import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SIgnUp';
import BerandaScreen from '../screens/BerandaScreen';
import { getData, STORAGE_KEYS } from '../utils/storage';

const Stack = createStackNavigator();

const Navigation = () => {
  const [initialRoute, setInitialRoute] = useState('Splash');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isLoggedIn = await getData(STORAGE_KEYS.IS_LOGGED_IN);
    if (isLoggedIn) {
      setInitialRoute('Beranda');
    } else {
      setInitialRoute('Splash');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Beranda" component={BerandaScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;
