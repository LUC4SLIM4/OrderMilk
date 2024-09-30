import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function FilterBar({
  pesquisa,
  setPesquisa,
  filtroLote,
  setFiltroLote,
  lotes,
}) {
  return (
    <View style={styles.filterContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar animal..."
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={filtroLote}
          style={styles.picker}
          onValueChange={(itemValue) => setFiltroLote(itemValue)}
        >
          {lotes.map((lote) => (
            <Picker.Item key={lote} label={lote} value={lote} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 10,
  },
  pickerContainer: {
    width: 150,
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
  },
});
