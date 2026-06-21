import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';

export default function BerandaScreen({ onLogout }) {
  const namaMahasiswa = "Mahasigma";
  const nimMahasiswa = "21072026"; 

  // State utama untuk nyimpen data laporan secara dinamis
  const [aktivitas, setAktivitas] = useState([]);

  // State untuk kontrol modal input
  const [modalVisible, setModalVisible] = useState(false);
  const [inputLaporan, setInputLaporan] = useState('');

  // State untuk nentuin halaman aktif ('beranda' atau 'riwayat')
  const [currentView, setCurrentView] = useState('beranda'); 

  // Fungsi buat nambahin laporan baru
  const handleTambahPengaduan = () => {
    if (inputLaporan.trim() === '') {
      Alert.alert('Error', 'Isi laporan dulu, bro!');
      return;
    }

    const laporanBaru = {
      id: Date.now().toString(),
      judul: inputLaporan,
      status: 'Menunggu Konfirmasi',
      tanggal: '21 Juni 2026', 
    };

    setAktivitas([laporanBaru, ...aktivitas]);
    setInputLaporan('');
    setModalVisible(false);
    Alert.alert('Sukses', 'Pengaduan lo berhasil dikirim!');
  };

  // ==========================================
  // 1. TAMPILAN VIEW RIWAYAT LAPORAN
  // ==========================================
  if (currentView === 'riwayat') {
    return (
      <View style={styles.container}>
        <View style={styles.headerRiwayat}>
          <TouchableOpacity onPress={() => setCurrentView('beranda')} style={styles.backButton}>
            <Text style={styles.backIcon}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitleRiwayat}>Riwayat Laporan Anda</Text>
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {aktivitas.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada laporan yang dibuat.</Text>
          ) : (
            aktivitas.map((item) => (
              <View key={item.id} style={styles.statusCard}>
                <Text style={styles.statusTitle}>{item.judul}</Text>
                <Text style={styles.statusBadgePending}>{item.status}</Text>
                <Text style={styles.statusDate}>ID Laporan: #{item.id.slice(-5)} • {item.tanggal}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // ==========================================
  // 2. TAMPILAN VIEW BERANDA UTAMA
  // ==========================================
  return (
    <View style={styles.container}>
      {/* Header Wilayah Atas */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Selamat Datang,</Text>
        <Text style={styles.nameText}>{namaMahasiswa}</Text>
        <Text style={styles.nimText}>NIM: {nimMahasiswa}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Menu SIPENTAS</Text>

        {/* Grid Tombol Menu Utama */}
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuCard} onPress={() => setModalVisible(true)}>
            <Text style={styles.menuIcon}>📝</Text>
            <Text style={styles.menuLabel}>Buat Pengaduan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => setCurrentView('riwayat')}>
            <Text style={styles.menuIcon}>⏳</Text>
            <Text style={styles.menuLabel}>Riwayat Laporan</Text>
          </TouchableOpacity>
        </View>

        {/* Status Singkat Pengaduan Terakhir */}
        <Text style={styles.sectionTitle}>Aktivitas Terakhir</Text>
        
        {aktivitas.slice(0, 2).map((item) => (
          <View key={item.id} style={styles.statusCard}>
            <Text style={styles.statusTitle}>{item.judul}</Text>
            <Text style={styles.statusBadgePending}>{item.status}</Text>
            <Text style={styles.statusDate}>Dikirim: {item.tanggal}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.buttonLogout} onPress={onLogout}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL FORM INPUT PENGADUAN */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tulis Pengaduan Fasilitas</Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Tuliskan masalah yang ingin Anda laporkan..."
              value={inputLaporan}
              onChangeText={setInputLaporan}
              multiline
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.buttonBatal]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonTextBatal}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.buttonKirim]} onPress={handleTambahPengaduan}>
                <Text style={styles.buttonTextKirim}>Kirim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#4A00E0',
    padding: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 50,
  },
  headerRiwayat: {
    backgroundColor: '#4A00E0',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  backIcon: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitleRiwayat: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: '#E0D4FF',
    fontSize: 14,
  },
  nameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  nimText: {
    color: '#E0D4FF',
    fontSize: 14,
    marginTop: 2,
  },
  contentContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  menuCard: {
    backgroundColor: '#FFF',
    width: '47%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
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
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statusBadgePending: {
    backgroundColor: '#FFEFAA',
    color: '#A07400',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    overflow: 'hidden',
  },
  statusDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
  },
  buttonLogout: {
    borderWidth: 1,
    borderColor: '#FF4D4D',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FF4D4D',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBatal: {
    marginRight: 10,
    backgroundColor: '#F1F3F5',
  },
  buttonKirim: {
    backgroundColor: '#4A00E0',
  },
  buttonTextBatal: {
    color: '#666',
    fontWeight: '600',
  },
  buttonTextKirim: {
    color: '#FFF',
    fontWeight: '600',
  },
});