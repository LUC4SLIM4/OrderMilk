import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';
import FlashMessage from "react-native-flash-message";
import LoginScreen from './src/pages/LoginScreen';
import AppSidebar from './AppSidebar';
import InicioScreen from './src/pages/InicioScreen';
import CadastrarAnimal from './src/pages/CadastrarAnimal';
import SignUp from './src/pages/SignUp';
import ForgotPassword from './src/pages/ForgotPassword';
import RegistrarTiradaScreen from './src/pages/RegistrarTiradaScreen';

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? 'AppSidebar' : 'LoginScreen'}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
          <Stack.Screen name="AppSidebar" component={AppSidebar} options={{ headerShown: false }} />
          <Stack.Screen name="InicioScreen" component={InicioScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CadastrarAnimal" component={CadastrarAnimal} options={{ headerShown: false }} />
          <Stack.Screen name="RegistrarTiradaScreen" component={RegistrarTiradaScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
        <FlashMessage position="bottom" />
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
});

export default App;
