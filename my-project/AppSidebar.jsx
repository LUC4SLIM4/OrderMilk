import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import DashboardScreen from './pages/DashboardScreen';
import SettingScreen from './pages/SettingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AppSidebar = () => {
  return (
    <Drawer.Navigator initialRouteName="HomeScreen">
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      <Drawer.Screen name="DashboardScreen" component={DashboardScreen} />
      <Drawer.Screen name="SettingsScreen" component={SettingScreen} />
    </Drawer.Navigator>
  );
};

export default AppSidebar;
