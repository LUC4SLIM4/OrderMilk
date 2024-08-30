import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginScreen';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo à Home!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;
