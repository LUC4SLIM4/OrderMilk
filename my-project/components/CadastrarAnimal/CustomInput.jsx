import React from 'react';
import { TextInput, StyleSheet, Text, View } from 'react-native';

const CustomInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    textAlign: 'center', // Centraliza o texto dentro do TextInput
  },  
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#003AAA',
    textAlign: 'center',
  },
});

export default CustomInput;
