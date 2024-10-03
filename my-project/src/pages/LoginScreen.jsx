import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../config/firebaseConfig';
import Input from '../components/LoginScreen/Input';
import Button from '../components/LoginScreen/Button';
import Link from '../components/LoginScreen/Link';
import { showMessage } from 'react-native-flash-message'; 

const LoginScreen = () => {
  const [credenciais, setCredenciais] = useState({ username: '', password: '' });
  const navigation = useNavigation();
  const auth = getAuth(app);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credenciais.username, credenciais.password);
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
    { label: 'Usuário', type: 'email', campo: 'username' },
    { label: 'Senha', type: 'password', campo: 'password' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.avatar} source={require("../assets/images/logo2.png")} />
        {inputsConfig.map((elm, index) => (
          <Input
            key={index}
            label={elm.label}
            type={elm.type}
            onChangeText={(text) => setCredenciais({ ...credenciais, [elm.campo]: text })}
          />
        ))}
        <Button onPress={handleLogin}>Entrar</Button>
        <View style={styles.links}>
          <Link onPress={() => navigation.navigate('SignUp')}>Cadastre-se</Link>
          <Link onPress={() => navigation.navigate('ForgotPassword')}>Esqueceu a Senha?</Link>
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
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 40,
    marginBottom: 20,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  linkText: {
    flex: 1,
    textAlign: 'center',
    maxWidth: 120,
  },
});

export default LoginScreen;
