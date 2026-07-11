import apiClient from './apiClient';

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
                message: error.response?.data?.message || 'Gagal registrasi'
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
                message: error.response?.data?.message || 'Gagal login'
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
                message: error.response?.data?.message || 'Gagal load data'
            };
        }
    },
};