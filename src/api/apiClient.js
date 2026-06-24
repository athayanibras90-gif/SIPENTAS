import axios from 'axios';

// ⚠️ GANTI DENGAN IP KOMPUTER KAMU!
// Cara cek IP: buka CMD → ketik 'ipconfig' → cari IPv4
const BASE_URL = 'http//192.168.142.147:8080/api';  // ← GANTI INI!

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default apiClient;