import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function LandingScreen({ onGetStarted }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeTitle}>Selamat Datang di SIPENTAS</Text>
      <Text style={styles.welcomeDesc}>
        Kelola masalah kelas dan lingkungan kampus Anda dengan lebih mudah dan cepat.
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={onGetStarted}>
      <Text style={styles.buttonText}>Mulai Sekarang</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  welcomeDesc: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4A00E0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});