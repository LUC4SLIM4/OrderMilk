import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import InicioScreen from "./src/pages/InicioScreen";
import CadastrarAnimal from "./src/pages/CadastrarAnimal";
import RebanhoScreen from "./src/pages/RebanhoScreen";
import GestaoNutritiva from "./src/pages/GestaoNutritiva";
import ManejoSanitario from "./src/pages/ManejoSanitario";
import RegistrarTiradaScreen from "./src/pages/RegistrarTiradaScreen";
import Producao from "./src/pages/Producao"
import ControleReprodutivo from "./src/pages/ControleReprodutivo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { View, Image, StyleSheet } from "react-native";

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  label: {
    color: "#003AAA",
    fontSize: 16,
  },
  image: {
    width: 80,
    height: 80,
    margin: 8,
  },
});

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();
  const sair = async () => {
    await AsyncStorage.clear();
    navigation.navigate("LoginScreen");
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View>
        <Image source={require("./src/assets/images/logo2.png")} style={styles.image} />
        {drawerItems.map((item) => (
          <DrawerItem
            key={item.label}
            label={item.label}
            icon={() => <item.icon name={item.name} size={24} color="#003AAA" />}
            onPress={() => props.navigation.navigate(item.screen)}
            labelStyle={styles.label}
          />
        ))}
      </View>
      <View>
        <DrawerItem
          label="Sair"
          icon={() => <Ionicons name="exit" size={24} color="#003AAA" />}
          onPress={sair}
          labelStyle={styles.label}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const drawerItems = [
  {
    label: "Inicio",
    screen: "InicioScreen",
    icon: Ionicons,
    name: "home",
  },
  {
    label: "Cadastrar Animal",
    screen: "CadastrarAnimal",
    icon: MaterialIcons,
    name: "add",
  },
  {
    label: "Rebanho",
    screen: "RebanhoScreen",
    icon: MaterialIcons,
    name: "list",
  },
  {
    label: "Registrar Tirada",
    screen: "RegistrarTiradaScreen",
    icon: MaterialIcons,
    name: "healing",
  },
  {
    label: "Produção",
    screen: "Producao",
    icon: MaterialIcons,
    name: "healing",
  },
  {
    label: "Gestão Nutritiva",
    screen: "GestaoNutritiva",
    icon: Ionicons,
    name: "nutrition",
  },
  {
    label: "Manejo Sanitário",
    screen: "ManejoSanitario",
    icon: MaterialIcons,
    name: "healing",
  },
  {
    label: "Controle Reprodutivo",
    screen: "ControleReprodutivo",
    icon: MaterialIcons,
    name: "pregnant-woman",
  },
];

const commonHeaderOptions = {
  headerTitleAlign: "center",
  headerTintColor: "#003AAA",
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: "bold",
  },
};

const AppSidebar = () => {
  return (
    <Drawer.Navigator
      initialRouteName="InicioScreen"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="InicioScreen"
        component={InicioScreen}
        options={{ title: "Início", ...commonHeaderOptions }}
      />
      <Drawer.Screen
        name="CadastrarAnimal"
        component={CadastrarAnimal}
        options={{ title: "Cadastro de Animal", ...commonHeaderOptions }}
      />
      <Drawer.Screen
        name="RebanhoScreen"
        component={RebanhoScreen}
        options={{ title: "Gestão de Rebanho", ...commonHeaderOptions }}
      />
      <Drawer.Screen
        name="RegistrarTiradaScreen"
        component={RegistrarTiradaScreen}
        options={{ title: "Registrar Tirada", ...commonHeaderOptions }}
      />
      <Drawer.Screen
        name="Producao"
        component={Producao}
        options={{ title: "Produção", ...commonHeaderOptions }}
      />
      <Drawer.Screen
        name="GestaoNutritiva"
        component={GestaoNutritiva}
        options={{ title: "Gestão Nutricional", ...commonHeaderOptions }}
      />
      <Drawer.Screen
        name="ManejoSanitario"
        component={ManejoSanitario}
        options={{ title: "Manejo Sanitário", ...commonHeaderOptions }}
      />
      <Drawer.Screen
        name="ControleReprodutivo"
        component={ControleReprodutivo}
        options={{ title: "Controle Reprodutivo", ...commonHeaderOptions }}
      />
    </Drawer.Navigator>
  );
};

export default AppSidebar;

