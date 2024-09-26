import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ListHeader() {
  return (
    <View style={styles.listHeader}>
      <Text style={styles.headerText}>Brinco</Text>
      <Text style={styles.headerText}>Nome</Text>
      <Text style={styles.headerText}>Lote</Text>
      <Text style={styles.headerText}>Ver Mais</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    backgroundColor: '#003AAA',
    padding: 10,
    marginBottom: 5,
  },
  headerText: {
    color: 'white',
    flex: 1, // Garante o alinhamento com os itens do AnimalListItem
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
