import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
// Pastiin arah import-nya udah pas sama folder lo ya
import SplashScreen from './src/screens/SplashScreen';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import BerandaScreen from './src/screens/BerandaScreen';

export default function App() {
  // State buat nentuin halaman mana yang lagi aktif
  // Nilai awalnya 'splash'
  const [screen, setScreen] = useState('splash');

  // Simulasi splash screen menghilang setelah 3 detik
  React.useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => {
        setScreen('landing');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Fungsi yang dipanggil pas user sukses login di LoginScreen
  const handleLoginSuccess = () => {
    setScreen('beranda');
  };

  // Fungsi pas user klik Keluar di BerandaScreen
  const handleLogout = () => {
    setScreen('landing');
  };

  return (
    <View style={styles.container}>
      {screen === 'splash' && <SplashScreen />}
      
      {screen === 'landing' && (
        <LandingScreen 
          onGetStarted={() => setScreen('login')} 
        />
      )}
      
      {screen === 'login' && (
        <LoginScreen 
          onBack={() => setScreen('landing')} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {screen === 'beranda' && (
        <BerandaScreen 
          onLogout={handleLogout}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});