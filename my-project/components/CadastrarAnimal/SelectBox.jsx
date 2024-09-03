import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const SelectBox = ({ label, value, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selectBox} onPress={onPress}>
        <Text style={styles.selectText}>{value || 'Toque Para Definir'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Centraliza os elementos horizontalmente
    marginBottom: 20, // Espaço inferior para evitar sobreposição com outros componentes
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#003AAA',
    textAlign: 'center', // Centraliza o texto da label
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Garante que o TouchableOpacity ocupe toda a largura disponível
  },
  selectText: {
    fontSize: 16,
    color: '#000',
  },
});

export default SelectBox;
