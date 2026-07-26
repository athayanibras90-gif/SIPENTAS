import apiClient from './apiClient';

const getErrorMessage = (error, defaultMsg) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return 'Server butuh waktu lama untuk merespons (cold start). Silakan coba lagi.';
    }
    if (error.message?.includes('Network Error')) {
        return 'Gagal terhubung ke server. Periksa koneksi internet Anda atau coba beberapa saat lagi.';
    }
    return error.message || defaultMsg;
};

export const UserService = {
    // ========== REGISTER ==========
    register: async (nim, password) => {
        try {
            const response = await apiClient.post('/users/register', { nim, password });
            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: getErrorMessage(error, 'Gagal registrasi')
            };
        }
    },

    // ========== LOGIN ==========
    login: async (nim, password) => {
        try {
            const response = await apiClient.post('/users/login', { nim, password });
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: getErrorMessage(error, 'Gagal login')
            };
        }
    },

    // ========== GET ALL USERS ==========
    getAllUsers: async () => {
        try {
            const response = await apiClient.get('/users/all');
            return response.data;
        } catch (error) {
            console.error('Get all error:', error);
            return {
                success: false,
                message: getErrorMessage(error, 'Gagal load data')
            };
        }
    },
    // ========== GET USER BY NIM untuk Profile ==========
    getUserByNim: async (nim) => {
        try {
            const response = await apiClient.get(`/users/${nim}`);
            return response.data;
        } catch (error) {
            console.error('Get user by NIM error:', error);
            return {
                success: false,
                message: getErrorMessage(error, 'Gagal load data pengguna')
            };
        }
    },

    
};