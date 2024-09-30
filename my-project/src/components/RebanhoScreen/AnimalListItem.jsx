import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AnimalListItem({ item, navigation }) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.brinco}</Text>
      <Text style={styles.itemText}>{item.nome}</Text>
      <Text style={styles.itemText}>{item.lote}</Text>
      <TouchableOpacity
        style={styles.iconContainer} // Ajuste para alinhamento
        onPress={() => navigation.navigate('DetalheAnimal', { animalId: item.id })}
      >
        <Icon name="eye-outline" size={28} color="#003AAA" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itemText: {
    flex: 1, // Garante que os textos ocupem o mesmo espaço em todas as colunas
    textAlign: 'center',
    fontSize: 17,
  },
  iconContainer: {
    flex: 1, // Adiciona o mesmo comportamento de flex para o ícone
    justifyContent: 'center', // Centraliza o ícone verticalmente
    alignItems: 'center', // Centraliza o ícone horizontalmente
  },
});
