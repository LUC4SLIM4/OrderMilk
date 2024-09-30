import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const InicioScreen = () => {
  const navigation = useNavigation();

  const buttons = [
    { title: 'Cadastrar Animal', onPress: () => navigation.navigate('CadastrarAnimal') },
    { title: 'Rebanho', onPress: () => navigation.navigate('RebanhoScreen') },
    { title: 'Produção', onPress: () => console.log('Produção') },
    { title: 'Outros', onPress: () => console.log('Outros'), style: styles.lastButton },
  ];

  return (
    <View style={styles.buttonContainer}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, button.style]}
          onPress={button.onPress}
        >
          <Text style={styles.buttonText}>{button.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 0.88,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 300,
    height: 100,
    backgroundColor: '#003AAA',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 5,
  },
  lastButton: {
    height: 50,
    backgroundColor: '#0055FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default InicioScreen;
