import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AnimalListItem({ item, navigation }) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('DetalheAnimal', { animalId: item.id })}
    >
      <Text style={styles.itemText}>{item.brinco}</Text>
      <Text style={styles.itemText}>{item.nomeAnimal}</Text>
      <Text style={styles.itemText}>{item.momentoReprodutivo}</Text>
      <View style={styles.iconContainer}>
        <Icon name="eye-outline" size={24} color="#003AAA" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 14,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});