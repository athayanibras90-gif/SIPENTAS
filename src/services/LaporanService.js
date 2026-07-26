import apiClient from './apiClient';

const getErrorMessage = (error, defaultMsg) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (typeof error.response?.data === 'string' && error.response.data.length < 200) {
        return error.response.data;
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return 'Server butuh waktu lama untuk merespons (cold start). Silakan coba lagi.';
    }
    if (error.message?.includes('Network Error')) {
        return 'Gagal terhubung ke server. Periksa koneksi internet Anda atau coba beberapa saat lagi.';
    }
    return error.message || defaultMsg;
};

export const LaporanService = {
    // ========== BUAT LAPORAN PENGADUAN / KELUHAN ==========
    // Parameter dataLaporan: { judul, deskripsi, ruangan, nim, image (opsional) }
    buatLaporan: async (dataLaporan) => {
        try {
            const formData = new FormData();
            const nimUser = dataLaporan.nim || '';
            formData.append('nim', nimUser);
            
            let textKeluhan = dataLaporan.judul || dataLaporan.deskripsi || '';
            if (dataLaporan.ruangan) {
                textKeluhan = `[Ruangan: ${dataLaporan.ruangan}] ${textKeluhan}`;
            }
            formData.append('isiKeluhan', textKeluhan);
            formData.append('isAnonim', 'false');

            if (dataLaporan.image) {
                const filename = dataLaporan.image.split('/').pop() || 'photo.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('file', {
                    uri: dataLaporan.image,
                    name: filename,
                    type: type,
                });

                const response = await apiClient.post('/keluhan/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return { success: true, message: response.data || 'Pengaduan berhasil dibuat' };
            } else {
                const response = await apiClient.post('/keluhan', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return { success: true, message: response.data || 'Pengaduan berhasil dibuat' };
            }
        } catch (error) {
            console.error('Buat laporan error:', error);
            return {
                success: false,
                message: getErrorMessage(error, 'Gagal membuat laporan')
            };
        }
    },

    // ========== AMBIL RIWAYAT LAPORAN BERDASARKAN NIM ==========
    getLaporanByNim: async (nim) => {
        return await LaporanService.getAllLaporan();
    },

    // ========== AMBIL SEMUA LAPORAN ==========
    getAllLaporan: async () => {
        try {
            const response = await apiClient.get('/keluhan');
            const dataList = Array.isArray(response.data) ? response.data : [];
            
            // Format item agar sesuai dengan UI Beranda
            const formattedData = dataList.map((item) => {
                let ruangan = null;
                let textIsi = item.isiKeluhan || item.judul || '';
                
                // Ekstrak tag [Ruangan: xxx] dari isiKeluhan jika ada
                const matchRuang = /^\[Ruangan:\s*([^\]]+)\]\s*(.*)$/i.exec(textIsi);
                if (matchRuang) {
                    ruangan = matchRuang[1];
                    textIsi = matchRuang[2];
                }

                return {
                    id: item.id || item._id,
                    judul: textIsi,
                    deskripsi: textIsi,
                    ruangan: ruangan || item.ruang || item.ruangan,
                    nim: item.nim,
                    status: item.status || 'DIAJUKAN',
                    tanggal: item.createdAt || item.created_at || item.tanggal,
                    created_at: item.createdAt || item.created_at,
                    gambar: item.gambar ? `https://sipentas-api.onrender.com/uploads/${item.gambar}` : null,
                };
            });

            return {
                success: true,
                data: formattedData
            };
        } catch (error) {
            console.error('Get all laporan error:', error);
            return {
                success: false,
                message: getErrorMessage(error, 'Gagal mengambil data laporan')
            };
        }
    }
};

export default LaporanService;
