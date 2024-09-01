import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import InicioScreen from './pages/InicioScreen';
import CadastrarAnimal from './pages/CadastrarAnimal';
import RebanhoScreen from './pages/RebanhoScreen';
import GestaoNutritiva from './pages/GestaoNutritiva';
import ManejoSanitario from './pages/ManejoSanitario';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

const Drawer = createDrawerNavigator();

const styles = {
  label: {
    color: '#003AAA',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
};

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();
  const sair = async () => {
    await AsyncStorage.clear();
    navigation.navigate('LoginScreen');
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View>
        <DrawerItem
          label="Inicio"
          onPress={() => props.navigation.navigate('InicioScreen')}
          style={styles.drawerItem}
          labelStyle={styles.label}
        />
        <DrawerItem
          label="Cadastrar Animal"
          onPress={() => props.navigation.navigate('CadastrarAnimal')}
          style={styles.drawerItem}
          labelStyle={styles.label}
        />
        <DrawerItem
          label="Rebanho"
          onPress={() => props.navigation.navigate('RebanhoScreen')}
          style={styles.drawerItem}
          labelStyle={styles.label}
        />
         <DrawerItem
          label="Gestão Nutritiva"
          onPress={() => props.navigation.navigate('GestaoNutritiva')}
          style={styles.drawerItem}
          labelStyle={styles.label}
        />
        <DrawerItem
          label="Manejo Sanitário"
          onPress={() => props.navigation.navigate('ManejoSanitario')}
          style={styles.drawerItem}
          labelStyle={styles.label}
        />
      </View>
      <View>
        <DrawerItem
          label="Sair"
          icon={() => <Ionicons name="exit" size={24} color="#003AAA"/>}
          onPress={sair}
          style={styles.drawerItem}
          labelStyle={styles.label}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const AppSidebar = () => {
  return (
    <Drawer.Navigator
      initialRouteName="InicioScreen"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="InicioScreen" component={InicioScreen} />
      <Drawer.Screen name="CadastrarAnimal" component={CadastrarAnimal} />
      <Drawer.Screen name="RebanhoScreen" component={RebanhoScreen} />
      <Drawer.Screen name="GestaoNutritiva" component={GestaoNutritiva} />
      <Drawer.Screen name="ManejoSanitario" component={ManejoSanitario} />
    </Drawer.Navigator>
  );
};

export default AppSidebar;