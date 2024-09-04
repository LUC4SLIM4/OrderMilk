import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { isAuthenticated } from '../api/auth';
import Input from '../components/LoginScreen/Input'; 
import Button from '../components/LoginScreen/Button'; 
import Link from '../components/LoginScreen/Link'; 

const LoginScreen = () => {
  const [credenciais, setCredenciais] = useState({ username: '', password: '' });
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (isAuthenticated(credenciais.username, credenciais.password)) {
      await AsyncStorage.setItem('user', JSON.stringify(credenciais));
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppSidebar' }],
      });
    } else {
      Alert.alert('Falha no Login', 'Usuário ou Senha estão incorretos');
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
    padding: '12%',
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 40,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default LoginScreen;
