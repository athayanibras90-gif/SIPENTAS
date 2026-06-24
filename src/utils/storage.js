import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys untuk storage
export const STORAGE_KEYS = {
    USER_DATA: '@sipentas_user',
    IS_LOGGED_IN: '@sipentas_isLoggedIn',
    TOKEN: '@sipentas_token',
    SETTINGS: '@sipentas_settings',
    REMEMBER_ME: '@sipentas_rememberMe'
};

// Simpan data
export const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
};

// Ambil data
export const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error getting data:', error);
        return null;
    }
};

// Hapus data
export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing data:', error);
        return false;
    }
};

// Hapus semua data (logout)
export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
};

// Simpan data user
export const saveUserData = async (userData) => {
    return await storeData(STORAGE_KEYS.USER_DATA, userData);
};

// Ambil data user
export const getUserData = async () => {
    return await getData(STORAGE_KEYS.USER_DATA);
};

// Set login status
export const setLoggedIn = async (status) => {
    return await storeData(STORAGE_KEYS.IS_LOGGED_IN, status);
};

// Check login status
export const isLoggedIn = async () => {
    return await getData(STORAGE_KEYS.IS_LOGGED_IN);
};

// Simpan token
export const saveToken = async (token) => {
    return await storeData(STORAGE_KEYS.TOKEN, token);
};

// Ambil token
export const getToken = async () => {
    return await getData(STORAGE_KEYS.TOKEN);
};

// Logout function
export const logout = async () => {
    try {
        await removeData(STORAGE_KEYS.USER_DATA);
        await removeData(STORAGE_KEYS.IS_LOGGED_IN);
        await removeData(STORAGE_KEYS.TOKEN);
        return true;
    } catch (error) {
        console.error('Error during logout:', error);
        return false;
    }
};