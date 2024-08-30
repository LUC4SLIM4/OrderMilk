import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { isAuthenticated } from '../api/auth';
import AppSidebar from '../AppSidebar';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (isAuthenticated(username, password)) {
      await AsyncStorage.setItem('user', JSON.stringify({ username, password }));
      setIsLoggedIn(true);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppSidebar' }],
      });
    } else {
      Alert.alert('Login Failed', 'Username or password is incorrect');
    }
  };

  const inputsConfig = [
    {
      label: 'Usuário',
      type: 'email',
      setter: setUsername,
    },
    {
      label: 'Senha',
      type: 'password',
      setter: setPassword,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.avatar} source={require("../assets/images/logo.png")} />
        {inputsConfig.map((elm, index) => (
          <TextInput
            key={index}
            onChangeText={(text) => elm.setter(text)}
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
          <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>Esqueceu a Senha?</Text>
          <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>Não possuo conta? Cadastrar</Text>
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
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 100,
    marginBottom: 10,
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
    backgroundColor: '#007bff',
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
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
