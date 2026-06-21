import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function LoginScreen({ onBack, onLoginSuccess }) {
  // State untuk menampung ketikan user
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');

  // Fungsi handle login dummy
  const handleLogin = () => {
    // Validasi input kosong
    if (!nim || !password) {
      Alert.alert('Error', 'NIM dan Password wajib diisi, Cuy!');
      return;
    }

    // Simulasi pengecekan Dummy Data
    if (nim === '123' && password === 'admin') {
      Alert.alert('Sukses', 'Login Berhasil! Selamat datang di SIPENTAS.', [
        { text: 'OK', onPress: () => onLoginSuccess() } // Begitu diklik OK, langsung pindah ke Beranda
      ]);
    } else {
      Alert.alert('Gagal', 'NIM atau Password salah. Coba ketik NIM: 123, Pass: admin');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Form */}
      <Text style={styles.title}>Masuk ke SIPENTAS</Text>
      <Text style={styles.subtitle}>Gunakan Nama atau NIM Kampus Anda</Text>

      {/* Input NIM */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>NIM Mahasiswa</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan NIM Anda (Contoh: 123)"
          placeholderTextColor="#999"
          value={nim}
          onChangeText={(text) => setNim(text)}
          keyboardType="default"
        />
      </View>

      {/* Input Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Password (Contoh: admin)"
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      {/* Tombol Login */}
      <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
        <Text style={styles.buttonText}>Masuk Sistem</Text>
      </TouchableOpacity>

      {/* Tombol Kembali Sementara */}
      <TouchableOpacity onPress={onBack} style={styles.buttonBack}>
        <Text style={styles.backText}>{"< Kembali ke Menu Awal"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A00E0',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FAFAFA',
    fontSize: 16,
    color: '#333',
  },
  buttonLogin: {
    backgroundColor: '#4A00E0',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonBack: {
    alignItems: 'center',
    marginTop: 25,
  },
  backText: {
    color: '#666',
    fontSize: 14,
  },
});