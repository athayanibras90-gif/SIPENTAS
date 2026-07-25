import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from "react-native"; // <-- Tambahin Platform di sini
import { useNavigation } from "@react-navigation/native";
import { UserService } from "../services/UserService";
import { saveUserData, setLoggedIn, saveToken } from "../utils/storage";

export default function LoginScreen() {
  const navigation = useNavigation();

  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validasi input kosong
    if (!nim || !password) {
      Alert.alert("Error", "NIM dan Password wajib diisi, Cuy!");
      return;
    }
    
    setLoading(true);

    try {
      const response = await UserService.login(nim, password);

      if (response && response.success !== false) {
        if (response.token) {
          await saveToken(response.token);
        }
        if (response.user) {
          await saveUserData(response.user);
        }
        await setLoggedIn(true);

        navigation.replace("Beranda");
      } else {
        Alert.alert("Error", response.message || "Login Gagal! NIM atau Password salah.");
      }
    } catch (error) {
      console.error("Login process error:", error);
      Alert.alert("Error", "Terjadi kesalahan jaringan atau server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <TouchableOpacity
        style={[styles.buttonLogin, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Masuk Sistem</Text>
        )}
      </TouchableOpacity>

      {/* Tombol ke Landing (nanti dihapus)*/}
      {/*
      <TouchableOpacity onPress={() => navigation.navigate("Landing")} style={styles.buttonBack}>
        <Text style={styles.backText}>{"< Kembali ke Menu Awal"}</Text>
      </TouchableOpacity>
      */}
      
      {/*Tombol ke Beranda, nanti dihapus kalo udah punya database*/}
      <TouchableOpacity
        onPress={() => navigation.navigate("Beranda")}
        style={styles.buttonBack}
      >
        <Text style={styles.backText}>{"Beranda >"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A00E0",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#FAFAFA",
    fontSize: 16,
    color: "#333",
  },
  buttonLogin: {
    backgroundColor: "#4A00E0",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonBack: {
    alignItems: "center",
    marginTop: 25,
  },
  backText: {
    color: "#666",
    fontSize: 14,
  },
});
