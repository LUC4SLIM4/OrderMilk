import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Link = ({ onPress, children }) => (
  <Text style={styles.link} onPress={onPress}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  link: {
    color: '#003AAA',
    textDecorationLine: 'underline',
  },
});

export default Link;
