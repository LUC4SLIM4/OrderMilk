import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { isAuthenticated } from '../api/auth';

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
    {
      label: 'Usuário',
      type: 'email',
      campo: 'username',
    },
    {
      label: 'Senha',
      type: 'password',
      campo: 'password',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.avatar} source={require("../assets/images/logo.png")} />
        {inputsConfig.map((elm, index) => (
          <TextInput
            key={index}
            onChangeText={(text) => setCredenciais({ ...credenciais, [elm.campo]: text })}
            placeholder={elm.label}
            secureTextEntry={elm.type === 'password'}
            keyboardType={elm.type === 'email' ? 'email-address' : 'default'}
            style={styles.input}
          />
        ))}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <View style={styles.links}>
          <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>Cadastre-se</Text>
          <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>Esqueceu a Senha?</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.88,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    padding: '12%',
    alignItems: 'center',
  },
  avatar: {
    width: 200,
    height: 150,
    borderRadius: 40,
  },
  input: {
    width: 300,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#003AAA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    width: 300,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  link: {
    color: '#003AAA',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;