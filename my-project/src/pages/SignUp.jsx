// src/screens/SignUp.js
import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../config/firebaseConfig';
import Input from '../components/LoginScreen/Input';
import Button from '../components/LoginScreen/Button';
import Link from '../components/LoginScreen/Link';
import FlashMessage from "react-native-flash-message";
import useValidation from '../hooks/SignUp/useValidation';

const SignUp = () => {
    const [credenciais, setCredenciais] = useState({
        name: '',
        email: '',
        propertyName: '',
        propertySize: '',
        lactatingAnimals: '',
        password: '',
        confirmpassword: '',
    });

    const navigation = useNavigation();
    const auth = getAuth(app);
    const { validateFields } = useValidation(credenciais); 

    const inputsConfig = [
        { label: 'Nome', campo: 'name', type: 'text' },
        { label: 'Email', campo: 'email', type: 'email', keyboardType: 'email-address' },
        { label: 'Nome da Propriedade', campo: 'propertyName', type: 'text' },
        { label: 'Tamanho da Propriedade (hec)', campo: 'propertySize', type: 'number', keyboardType: 'numeric' },
        { label: 'Número de Animais Lactantes Atual', campo: 'lactatingAnimals', type: 'number', keyboardType: 'numeric' },
        { label: 'Senha', campo: 'password', type: 'password' },
        { label: 'Confirmar Senha', campo: 'confirmpassword', type: 'password' },
    ];

    const handleSignUp = async () => {
        if (!validateFields()) return;

        try {
            const { email, password } = credenciais;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await AsyncStorage.setItem('user', JSON.stringify(userCredential.user));
            navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
        } catch (error) {
            showMessage({ message: 'Erro ao cadastrar: ' + error.message, type: "danger" });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
                <Image style={styles.avatar} source={require("../assets/images/logo2.png")} />
                {inputsConfig.map(({ label, campo, type, keyboardType }, index) => (
                    <Input
                        key={index}
                        label={label}
                        campo={campo}
                        type={type}
                        keyboardType={keyboardType}
                        onChangeText={(text) => setCredenciais((prev) => ({ ...prev, [campo]: text }))}
                    />
                ))}
                <Button onPress={handleSignUp}>Cadastrar</Button>
                <View style={styles.link}>
                    <Link onPress={() => navigation.navigate('LoginScreen')}>Voltar</Link>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        width: '100%', // Adiciona largura 100% para o container
    },
    avatar: {
        marginTop: 20,
        width: 150,
        height: 150,
        borderRadius: 40,
        alignSelf: 'center', // Centraliza a imagem horizontalmente
    },
    link: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20, // Adiciona espaçamento acima do link
    },
});

export default SignUp;
