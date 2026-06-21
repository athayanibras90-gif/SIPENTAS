import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  // Gak perlu ada setTimeout yang manggil onFinish() lagi di sini,
  // karena perpindahan 3 detik sudah diatur sama App.js kita!

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>SIPENTAS</Text>
      <ActivityIndicator size="large" color="#FFF" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A00E0', // Warna ungu SIPENTAS
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
  },
  loader: {
    marginTop: 20,
  },
});