import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ onPress, children }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
});

export default Button;
