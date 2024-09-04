import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = ({ label, type, onChangeText }) => (
  <TextInput
    placeholder={label}
    secureTextEntry={type === 'password'}
    keyboardType={type === 'email' ? 'email-address' : 'default'}
    onChangeText={onChangeText}
    style={styles.input}
  />
);

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default Input;
