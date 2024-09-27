import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Importe as funções necessárias
import app from '../config/firebaseConfig'; // Importando a configuração do Firebase
import Input from '../components/LoginScreen/Input'; 
import Button from '../components/LoginScreen/Button'; 
import Link from '../components/LoginScreen/Link'; 
import { ScrollView } from 'react-native-gesture-handler';

const SignUp = () => {
  const [credenciais, setCredenciais] = useState({
    name: '',
    email: '',
    propertyName: '',
    propertySize: '',
    lactatingAnimals: '',
    password: '',
  });

  const navigation = useNavigation();
  const auth = getAuth(app); // Inicializando a autenticação com o Firebase

  const inputsConfig = [
    { label: 'Nome', type: 'text', campo: 'name' },
    { label: 'Email', type: 'email', campo: 'email' },
    { label: 'Nome da Propriedade', type: 'text', campo: 'propertyName' },
    { label: 'Tamanho da Propriedade (hec)', type: 'number', campo: 'propertySize', keyboardType: 'numeric' },
    { label: 'Número de Animais Lactantes Atual', type: 'number', campo: 'lactatingAnimals', keyboardType:  'numeric' },
    { label: 'Senha', type: 'password', campo: 'password' },
    { label: 'Confirmar Senha', type: 'password', campo: 'confirmpassword' }
  ];

  const handleSignUp = async () => {
    const { email, password } = credenciais;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // O usuário foi criado com sucesso
      await AsyncStorage.setItem('user', JSON.stringify(userCredential.user));
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.avatar} source={require("../assets/images/logo2.png")} />
        {inputsConfig.map((elm, index) => (
          <Input
            key={index}
            label={elm.label}
            type={elm.type}
            keyboardType={elm.keyboardType}
            onChangeText={(text) => setCredenciais({ ...credenciais, [elm.campo]: text })}
          />
        ))}
        <Button onPress={handleSignUp}>Cadastrar</Button>
        <View style={styles.links}>
          <Link onPress={() => navigation.navigate('LoginScreen')}>Voltar</Link>
        </View>
      </View>
    </View>
    </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignUp;
