import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../components/LoginScreen/Input'; 
import Button from '../components/LoginScreen/Button'; 
import Link from '../components/LoginScreen/Link';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; 
import { useNavigation } from '@react-navigation/native'; 
import FlashMessage, { showMessage } from 'react-native-flash-message'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();
    const auth = getAuth();

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const ERROR_MESSAGES = {
        emptyEmail: 'Por favor, insira um email.', 
        invalidEmail: 'Por favor, insira um email válido.',
        invalidFirebaseEmail: 'Este email é inválido.',
        userNotFound: 'Email não encontrado no Firebase Auth.',
        operationNotAllowed: 'Operação não permitida.',
        emailSent: (email) => `O email de recuperação de senha foi enviado para ${email}.`
    };

    const handleError = (error) => {
        switch (error.code) {
            case 'auth/invalid-email':
                showMessage({ message: ERROR_MESSAGES.invalidFirebaseEmail, type: 'danger' });
                break;
            case 'auth/user-not-found':
                showMessage({ message: ERROR_MESSAGES.userNotFound, type: 'danger' });
                break;
            case 'auth/operation-not-allowed':
                showMessage({ message: ERROR_MESSAGES.operationNotAllowed, type: 'danger' });
                break;
            default:
                showMessage({ message: error.message, type: 'danger' });
                break;
        }
    };

    const handlePasswordReset = () => {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            showMessage({ message: ERROR_MESSAGES.emptyEmail, type: 'danger' });
            return;
        }

        if (!isValidEmail(trimmedEmail)) {
            showMessage({ message: ERROR_MESSAGES.invalidEmail, type: 'danger' });
            return;
        }

        sendPasswordResetEmail(auth, trimmedEmail)
            .then(() => {
                showMessage({ message: ERROR_MESSAGES.emailSent(trimmedEmail), type: 'success' });
                navigation.navigate('LoginScreen');
            })
            .catch(handleError);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Esqueceu a senha?</Text>
                <Input
                    label="Email"
                    type="email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                />
                <Button onPress={handlePasswordReset}>Recuperar</Button>
                <Link onPress={() => navigation.navigate('LoginScreen')}>Voltar</Link>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    content: {
        padding: '12%',
        alignItems: 'center',
    },
    title: {
        marginBottom: 20,
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ForgotPassword;
