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

const SignUp = ({ navigation }) => {
    const [nim, setNim] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        // Validasi
        if (!nim || !password || !confirmPassword) {
            Alert.alert('Error', 'Semua field harus diisi');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Password dan Konfirmasi Password tidak sama');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password minimal 6 karakter');
            return;
        }

        setLoading(true);

        try {
            const result = await UserService.register(nim, password);

            setLoading(false);

            if (result.success) {
                Alert.alert('Sukses', 'Registrasi berhasil! Silakan login.');
                // Reset form
                setNim('');
                setPassword('');
                setConfirmPassword('');
                // Pindah ke halaman login
                navigation.replace('SignIn');
            } else {
                Alert.alert('Gagal', result.message || 'Registrasi gagal');
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
            console.error('Register error:', error);
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
                    <Text style={styles.subtitle}>Daftar Akun Baru</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan NIM"
                        value={nim}
                        onChangeText={setNim}
                        keyboardType="default"
                        autoFocus={true}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Konfirmasi Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Daftar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignIn')}
                        style={styles.linkButton}
                    >
                        <Text style={styles.linkText}>
                            Sudah punya akun? <Text style={styles.linkBold}>Login di sini</Text>
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
        backgroundColor: '#34C759',
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

export default SignUp;