// src/config/index.js
import { API_URL, API_KEY } from '@env';

export const CONFIG = {
    API_URL: API_URL || 'https://sipentas-api.onrender.com/api',
    API_KEY: API_KEY || 'SIPENTAS-APP-FIXED-KEY',
    TIMEOUT: 10000,
};

export default CONFIG;