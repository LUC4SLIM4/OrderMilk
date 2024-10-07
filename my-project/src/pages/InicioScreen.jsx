import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Chart from '../components/InicioScreen/Chart';

const InicioScreen = () => {
  const navigation = useNavigation();

  const buttons = [
    { title: 'Cadastrar Animal', onPress: () => navigation.navigate('CadastrarAnimal') },
    { title: 'Rebanho', onPress: () => navigation.navigate('RebanhoScreen') },
    { title: 'Manejo Sanitário', onPress: () => navigation.navigate('ManejoSanitario') },
    { title: 'Outros', onPress: () => console.log('Outros') },
    { title: 'Botão 5', onPress: () => console.log('Botão 5') },
    { title: 'Botão 6', onPress: () => console.log('Botão 6') },
  ];

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.buttonGrid}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={button.onPress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.chartContainer}>
          <Chart />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#003AAA',
    padding: 50,
    borderRadius: 5,
    width: '48%',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
});

export default InicioScreen;
