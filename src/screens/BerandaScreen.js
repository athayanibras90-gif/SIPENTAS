import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { logout, getUserData } from "../utils/storage";
import { LaporanService } from "../services/LaporanService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BerandaScreen() {
  const navigation = useNavigation();
  const [namaMahasiswa, setNamaMahasiswa] = useState("Mahasiswa");
  const [nimMahasiswa, setNimMahasiswa] = useState("-");

  // State data pengaduan dari database
  const [aktivitas, setAktivitas] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // State untuk form modal input
  const [modalVisible, setModalVisible] = useState(false);
  const [inputLaporan, setInputLaporan] = useState("");
  const [inputRuangan, setInputRuangan] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State kontrol halaman aktif ('beranda' atau 'riwayat')
  const [currentView, setCurrentView] = useState("beranda");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getUserData();
      let currentNim = "-";
      if (userData && userData.nim) {
        currentNim = userData.nim;
        setNimMahasiswa(userData.nim);
        setNamaMahasiswa(userData.nama || "Mahasiswa");
      }
      fetchLaporanData(currentNim);
    } catch (error) {
      console.error("Error loading user data in Beranda:", error);
      fetchLaporanData("-");
    }
  };

  const fetchLaporanData = async (nim) => {
    setIsLoadingData(true);
    try {
      let res;
      if (nim && nim !== "-") {
        res = await LaporanService.getLaporanByNim(nim);
      } else {
        res = await LaporanService.getAllLaporan();
      }

      if (res && res.success !== false) {
        const listData = Array.isArray(res)
          ? res
          : res.data || res.laporan || [];
        setAktivitas(listData);
      } else {
        console.log("Response fetch laporan:", res);
      }
    } catch (error) {
      console.error("Error fetching data pengaduan:", error);
    } finally {
      setIsLoadingData(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLaporanData(nimMahasiswa);
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace("SignIn");
  };

  // Handler memilih gambar dari Galeri
  const handlePickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Izin Ditolak",
          "Izin akses galeri diperlukan untuk memilih foto."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Gagal memilih gambar.");
    }
  };

  // Handler mengambil foto dari Kamera
  const handleTakeCamera = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Izin Ditolak",
          "Izin akses kamera diperlukan untuk mengambil foto."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Gagal mengambil foto.");
    }
  };

  // Fungsi buat nambahin pengaduan ke database
  const handleTambahPengaduan = async () => {
    if (inputLaporan.trim() === "") {
      Alert.alert(
        "Validasi Gagal",
        "Bagian deskripsi/text masalah pengaduan wajib diisi!"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const dataLaporan = {
        judul: inputLaporan.trim(),
        deskripsi: inputLaporan.trim(),
        ruangan: inputRuangan.trim(),
        nim: nimMahasiswa,
        image: selectedImage,
      };

      const res = await LaporanService.buatLaporan(dataLaporan);

      if (res && res.success !== false) {
        Alert.alert("Sukses", "Pengaduan berhasil terkirim ke database!");
        setInputLaporan("");
        setInputRuangan("");
        setSelectedImage(null);
        setModalVisible(false);
        fetchLaporanData(nimMahasiswa);
      } else {
        Alert.alert(
          "Gagal",
          res?.message || "Gagal menyimpan pengaduan ke database."
        );
      }
    } catch (error) {
      console.error("Error submit pengaduan:", error);
      Alert.alert("Error", "Terjadi kesalahan saat menghubungi database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format tanggal tampilan
  const formatDate = (dateString) => {
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // 1. TAMPILAN VIEW RIWAYAT LAPORAN
  // ==========================================
  if (currentView === "riwayat") {
    return (
      <View style={styles.container}>
        <View style={styles.headerRiwayat}>
          <TouchableOpacity
            onPress={() => setCurrentView("beranda")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitleRiwayat}>Riwayat Laporan Anda</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoadingData ? (
            <ActivityIndicator
              size="large"
              color="#4A00E0"
              style={{ marginTop: 30 }}
            />
          ) : aktivitas.length === 0 ? (
            <Text style={styles.emptyText}>
              Belum ada laporan yang dibuat di database.
            </Text>
          ) : (
            aktivitas.map((item, index) => {
              const imageUri =
                item.gambar || item.image || item.image_url || item.gambar_url;
              return (
                <View key={item.id || item._id || index} style={styles.statusCard}>
                  <Text style={styles.statusTitle}>
                    {item.judul || item.deskripsi}
                  </Text>

                  {item.ruangan ? (
                    <Text style={styles.ruanganText}>
                      📍 Ruangan: {item.ruangan}
                    </Text>
                  ) : null}

                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.cardImagePreview}
                      resizeMode="cover"
                    />
                  ) : null}

                  <Text style={styles.statusBadgePending}>
                    {item.status || "Menunggu Konfirmasi"}
                  </Text>
                  <Text style={styles.statusDate}>
                    ID Laporan: #{String(item.id || item._id || index).slice(-5)}{" "}
                    • {formatDate(item.created_at || item.tanggal)}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Wilayah Atas */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Selamat Datang,</Text>
        <Text style={styles.nameText}>{namaMahasiswa}</Text>
        <Text style={styles.nimText}>NIM: {nimMahasiswa}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Menu SIPENTAS</Text>

        {/* Grid Tombol Menu Utama */}
        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.menuIcon}>📝</Text>
            <Text style={styles.menuLabel}>Buat Pengaduan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => setCurrentView("riwayat")}
          >
            <Text style={styles.menuIcon}>⏳</Text>
            <Text style={styles.menuLabel}>Riwayat Laporan</Text>
          </TouchableOpacity>
        </View>

        {/* Status Singkat Pengaduan Terakhir */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Aktivitas Terakhir</Text>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={18} color="#4A00E0" />
          </TouchableOpacity>
        </View>

        {isLoadingData ? (
          <ActivityIndicator size="small" color="#4A00E0" style={{ marginVertical: 15 }} />
        ) : aktivitas.length === 0 ? (
          <Text style={styles.emptyTextSmall}>Belum ada aktivitas pengaduan.</Text>
        ) : (
          aktivitas.slice(0, 3).map((item, index) => {
            const imageUri =
              item.gambar || item.image || item.image_url || item.gambar_url;
            return (
              <View key={item.id || item._id || index} style={styles.statusCard}>
                <Text style={styles.statusTitle}>
                  {item.judul || item.deskripsi}
                </Text>

                {item.ruangan ? (
                  <Text style={styles.ruanganText}>
                    📍 Ruangan: {item.ruangan}
                  </Text>
                ) : null}

                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.cardImagePreviewSmall}
                    resizeMode="cover"
                  />
                ) : null}

                <Text style={styles.statusBadgePending}>
                  {item.status || "Menunggu Konfirmasi"}
                </Text>
                <Text style={styles.statusDate}>
                  Dikirim: {formatDate(item.created_at || item.tanggal)}
                </Text>
              </View>
            );
          })
        )}

        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL FORM INPUT PENGADUAN */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Tulis Pengaduan Fasilitas</Text>

              {/* Input Masalah (Wajib) */}
              <Text style={styles.inputLabel}>
                Masalah Pengaduan <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Tuliskan detail masalah yang ingin Anda laporkan..."
                value={inputLaporan}
                onChangeText={setInputLaporan}
                multiline
              />

              {/* Input Ruangan (Opsional) */}
              <Text style={styles.inputLabel}>
                Ruangan / Lokasi <Text style={styles.optionalText}>(Opsional)</Text>
              </Text>
              <TextInput
                style={styles.textInputShort}
                placeholder="Contoh: Ruang 302, Lab Komputer, Gedung B"
                value={inputRuangan}
                onChangeText={setInputRuangan}
              />

              {/* Lampirkan Gambar (Opsional) */}
              <Text style={styles.inputLabel}>
                Foto Bukti <Text style={styles.optionalText}>(Opsional)</Text>
              </Text>
              <View style={styles.imagePickerRow}>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={handlePickImage}
                >
                  <Ionicons name="images" size={18} color="#4A00E0" />
                  <Text style={styles.pickerButtonText}>Galeri</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={handleTakeCamera}
                >
                  <Ionicons name="camera" size={18} color="#4A00E0" />
                  <Text style={styles.pickerButtonText}>Kamera</Text>
                </TouchableOpacity>
              </View>

              {/* Preview Gambar Terpilih */}
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setSelectedImage(null)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF4D4D" />
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* Tombol Aksi Modal */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.buttonBatal]}
                  onPress={() => {
                    if (!isSubmitting) setModalVisible(false);
                  }}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonTextBatal}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.buttonKirim]}
                  onPress={handleTambahPengaduan}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.buttonTextKirim}>Kirim</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#4A00E0",
    padding: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 50,
  },
  headerRiwayat: {
    backgroundColor: "#4A00E0",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitleRiwayat: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  welcomeText: {
    color: "#E0D4FF",
    fontSize: 14,
  },
  nameText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
  },
  nimText: {
    color: "#E0D4FF",
    fontSize: 14,
    marginTop: 2,
  },
  contentContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginTop: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  menuCard: {
    backgroundColor: "#FFF",
    width: "47%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  ruanganText: {
    fontSize: 13,
    color: "#4A00E0",
    marginTop: 4,
    fontWeight: "500",
  },
  cardImagePreview: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginTop: 10,
  },
  cardImagePreviewSmall: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  },
  statusBadgePending: {
    backgroundColor: "#FFEFAA",
    color: "#A07400",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
    overflow: "hidden",
  },
  statusDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 8,
  },
  buttonLogout: {
    borderWidth: 1,
    borderColor: "#FF4D4D",
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#FF4D4D",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
  emptyTextSmall: {
    textAlign: "center",
    color: "#999",
    marginVertical: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  requiredStar: {
    color: "#FF4D4D",
  },
  optionalText: {
    color: "#888",
    fontWeight: "normal",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    height: 90,
    textAlignVertical: "top",
    marginBottom: 14,
    backgroundColor: "#FAFAFA",
  },
  textInputShort: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
    backgroundColor: "#FAFAFA",
  },
  imagePickerRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  pickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#4A00E0",
    borderRadius: 8,
    paddingVertical: 10,
    backgroundColor: "#F4EFFD",
  },
  pickerButtonText: {
    color: "#4A00E0",
    fontWeight: "600",
    fontSize: 13,
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 16,
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonBatal: {
    marginRight: 10,
    backgroundColor: "#F1F3F5",
  },
  buttonKirim: {
    backgroundColor: "#4A00E0",
  },
  buttonTextBatal: {
    color: "#666",
    fontWeight: "600",
  },
  buttonTextKirim: {
    color: "#FFF",
    fontWeight: "600",
  },
});
