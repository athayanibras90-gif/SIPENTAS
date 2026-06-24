import apiClient from '../api/apiClient';

export const UserService = {
    // REGISTER
    register: async (id, password) => {
        try {
            const response = await apiClient.post('/users/register', { id, password });
            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Gagal registrasi' };
        }
    },

    // LOGIN
    login: async (id, password) => {
        try {
            const response = await apiClient.post('/users/login', { id, password });
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Gagal login' };
        }
    },

    // GET ALL USERS
    getAllUsers: async () => {
        try {
            const response = await apiClient.get('/users/all');
            return response.data;
        } catch (error) {
            console.error('Get all error:', error);
            return { success: false, message: 'Gagal load data' };
        }
    },
};