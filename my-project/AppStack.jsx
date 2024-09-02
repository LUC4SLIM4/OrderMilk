import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './pages/LoginScreen';
import AppSidebar from './AppSidebar';
import InicioScreen from './pages/InicioScreen';
import CadastrarAnimal from './pages/CadastrarAnimal';

const Stack = createStackNavigator();

const AppStack = () => {
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'AppSidebar' : 'LoginScreen'}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AppSidebar" component={AppSidebar} options={{ headerShown: false }} />
        <Stack.Screen name="InicioScreen" component={InicioScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CadastrarAnimal" component={CadastrarAnimal} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;