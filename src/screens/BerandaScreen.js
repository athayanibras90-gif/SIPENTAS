import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function BerandaScreen({ onLogout }) {
  // Anggap aja ini data dummy mahasiswa yang berhasil login
  const namaMahasiswa = "Athaya Nibras";
  const nimMahasiswa = "A11.2026.127"; 

  return (
    <View style={styles.container}>
      {/* Header Wilayah Atas */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Selamat Datang,</Text>
        <Text style={styles.nameText}>{namaMahasiswa}</Text>
        <Text style={styles.nimText}>NIM: {nimMahasiswa}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Judul Menu */}
        <Text style={styles.sectionTitle}>Menu SIPENTAS</Text>

        {/* Grid Tombol Menu Utama */}
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuCard} onPress={() => alert('Ke Form Pengaduan')}>
            <Text style={styles.menuIcon}>📝</Text>
            <Text style={styles.menuLabel}>Buat Pengaduan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => alert('Ke Riwayat Laporan')}>
            <Text style={styles.menuIcon}>⏳</Text>
            <Text style={styles.menuLabel}>Riwayat Laporan</Text>
          </TouchableOpacity>
        </View>

        {/* Status Singkat Pengaduan Terakhir */}
        <Text style={styles.sectionTitle}>Aktivitas Terakhir</Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Laporan AC Ruang D.3.2 Mati</Text>
          <Text style={styles.statusBadgePending}>Menunggu Konfirmasi</Text>
          <Text style={styles.statusDate}>Dikirim: 21 Juni 2026</Text>
        </View>

        {/* Tombol Keluar / Keluar Akun */}
        <TouchableOpacity style={styles.buttonLogout} onPress={onLogout}>
          <Text style={styles.logoutText}>Keluar dari Sistem</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 35,
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
  },
  logoutText: {
    color: '#FF4D4D',
    fontSize: 14,
    fontWeight: 'bold',
  },
});