import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../config/firebaseConfig';
import { showMessage } from 'react-native-flash-message';

const LoginScreen = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigation = useNavigation();
  const auth = getAuth(app);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.username, credentials.password);
      await AsyncStorage.setItem('user', JSON.stringify(userCredential.user));
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppSidebar' }],
      });
    } catch (error) {
      let message = 'Usuário ou Senha estão incorretos.';
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          message = 'Senha incorreta.';
          break;
      }
      showMessage({
        message,
        type: 'danger',
        duration: 3000,
      });
    }
  };

  const inputsConfig = [
    { label: 'Usuário', type: 'email', field: 'username' },
    { label: 'Senha', type: 'password', field: 'password' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.logo} source={require("../assets/images/logo2.png")} />
        {inputsConfig.map((input, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{input.label}</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={input.type === 'password'}
              onChangeText={(text) => setCredentials({ ...credentials, [input.field]: text })}
              placeholder={input.label}
              placeholderTextColor="#999"
            />
          </View>
        ))}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
        <View style={styles.links}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkText}>Cadastre-se</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.linkText}>Esqueceu a Senha?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFF",
  },
  content: {
    padding: 30,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#003AAA',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  linkText: {
    color: '#003AAA',
    fontSize: 16,
  },
});

export default LoginScreen;