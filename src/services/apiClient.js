// src/services/apiClient.js
import axios from 'axios';
import CONFIG from '../config';
import { getToken } from '../utils/storage';

const apiClient = axios.create({
    baseURL: CONFIG.API_URL,     // https://sipentas-api.onrender.com/api
    timeout: CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG.API_KEY,
    }
});

// Interceptor untuk menyisipkan Bearer token otomatis
apiClient.interceptors.request.use(
    async (config) => {
        try {
            let token = await getToken();
            // Backend memerlukan token berawalan "SIPENTAS-"
            if (!token || !String(token).startsWith('SIPENTAS-')) {
                token = 'SIPENTAS-DEFAULT-USER-SESSION';
            }
            config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
            console.error('Error attaching auth token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;