import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginScreen';


const InicioScreen = () => {
  return (
  <View style={styles.container}>

      <TouchableOpacity style={styles.button} onPress={() => console.log('Cadastrar Animal')}>
        <Text style={styles.buttonText}>Cadastrar Animal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => console.log('Rebanho')}>
        <Text style={styles.buttonText}>Rebanho</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => console.log('Produção')}>
        <Text style={styles.buttonText}>Produção</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => console.log('Outros')}>
        <Text style={styles.buttonText}>Outros</Text>
      </TouchableOpacity>
      
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: 300,
    height: 80,
    backgroundColor: '#003AAA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default InicioScreen;
