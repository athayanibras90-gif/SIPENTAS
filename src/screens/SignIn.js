import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { UserService } from '../services/UserService';
import { saveUserData, setLoggedIn } from '../utils/storage';

const SignIn = ({ navigation }) => {
    const [nim, setNim] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!nim || !password) {
            Alert.alert('Error', 'NIM dan Password harus diisi');
            return;
        }

        setLoading(true);

        try {
            const result = await UserService.login(nim, password);

            setLoading(false);

            if (result.success) {
                await saveUserData({ nim });
                await setLoggedIn(true);

                Alert.alert('Sukses', 'Login berhasil!');
                navigation.replace('Beranda');
            } else {
                Alert.alert('Gagal', result.message || 'NIM atau password salah');
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
            console.error('Login error:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>
                    <Text style={styles.title}>SIPENTAS</Text>
                    <Text style={styles.subtitle}>Login</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan NIM"
                        value={nim}
                        onChangeText={setNim}
                        autoFocus={true}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSignIn}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUp')}
                        style={styles.linkButton}
                    >
                        <Text style={styles.linkText}>
                            Belum punya akun? <Text style={styles.linkBold}>Daftar di sini</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#007AFF',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 25,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 14,
        paddingHorizontal: 15,
        marginBottom: 14,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    linkButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
        color: '#666',
    },
    linkBold: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

export default SignIn;