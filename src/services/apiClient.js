import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
    baseURL: BASE_URL,  
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});


export default apiClient;