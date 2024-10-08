import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const RegistrarTirada = () => {
  const [data, setData] = useState(new Date());
  const [modoTirada, setModoTirada] = useState(null);
  const [vacas, setVacas] = useState([
    { id: '1', nome: 'Vaca 1', brinco: '123' },
    { id: '2', nome: 'Vaca 2', brinco: '124' },
    { id: '3', nome: 'Vaca 3', brinco: '125' },
    { id: '4', nome: 'Vaca 4', brinco: '126' },
    { id: '5', nome: 'Vaca 5', brinco: '127' },
    { id: '6', nome: 'Vaca 6', brinco: '128' },
    { id: '7', nome: 'Vaca 7', brinco: '129' },
    { id: '8', nome: 'Vaca 8', brinco: '130' },
    { id: '9', nome: 'Vaca 9', brinco: '131' },
    { id: '10', nome: 'Vaca 10', brinco: '132' },
    { id: '11', nome: 'Vaca 11', brinco: '133' },
    { id: '12', nome: 'Vaca 12', brinco: '134' },
  ]);
  const [filtro, setFiltro] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const incrementarData = (dias) => {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    setData(novaData);
  };

  const formatarData = (data) => {
    const opcoes = { year: 'numeric', month: 'long', day: 'numeric', locale: 'pt-BR' };
    return data.toLocaleDateString('pt-BR', opcoes);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setData(date);
    hideDatePicker();
  };

  const renderizarVaca = ({ item }) => (
    <View style={styles.vacaContainer}>
      <Text style={styles.vacaNome}>{item.nome} - Brinco: {item.brinco}</Text>
      <View style={styles.botoesTirada}>
        <TouchableOpacity style={styles.registrarBotao} onPress={() => { /* Função para registrar tirada */ }}>
          <Text style={styles.registrarTexto}>Registrar 1° Tirada</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registrarBotao} onPress={() => { /* Função para registrar tirada */ }}>
          <Text style={styles.registrarTexto}>Registrar 2° Tirada</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registrarBotao} onPress={() => { /* Função para registrar tirada */ }}>
          <Text style={styles.registrarTexto}>Registrar 3° Tirada</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dataContainer}>
        <TouchableOpacity onPress={() => incrementarData(-1)}>
          <Text style={styles.dataBotao}>{'<'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={showDatePicker}>
          <Text style={styles.dataTexto}>{formatarData(data)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => incrementarData(1)}>
          <Text style={styles.dataBotao}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        locale="pt-BR"
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalTexto}>Total de leite: 0 Litros</Text>
      </View>

      <View style={styles.modoContainer}>
        <TouchableOpacity style={styles.modoBotao} onPress={() => setModoTirada('vaca')}>
          <Text style={styles.modoTexto}>Vaca a Vaca</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modoBotao} onPress={() => setModoTirada('todas')}>
          <Text style={styles.modoTexto}>Todas de uma vez</Text>
        </TouchableOpacity>
      </View>

      {modoTirada === 'vaca' && (
        <View style={styles.secaoContainer}>
          <View style={styles.filtroContainer}>
            <Ionicons name="search" size={20} color="#003AAA" style={styles.filtroIcono} />
            <TextInput
              placeholder="Filtrar por brinco"
              value={filtro}
              onChangeText={setFiltro}
              style={styles.filtroInput}
            />
          </View>
          <FlatList
            data={vacas.filter(v => v.brinco.includes(filtro))}
            keyExtractor={(item) => item.id}
            renderItem={renderizarVaca}
          />
        </View>
      )}

      {modoTirada === 'todas' && (
        <View style={styles.secaoContainer}>
          <Text style={styles.secaoTitulo}>Registrar Tiradas para Todas</Text>
          <View style={styles.botoesTirada}>
            <TouchableOpacity style={styles.registrarBotao} onPress={() => { /* Função para registrar tirada */ }}>
              <Text style={styles.registrarTexto}>Registrar 1° Tirada</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registrarBotao} onPress={() => { /* Função para registrar tirada */ }}>
              <Text style={styles.registrarTexto}>Registrar 2° Tirada</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registrarBotao} onPress={() => { /* Função para registrar tirada */ }}>
              <Text style={styles.registrarTexto}>Registrar 3° Tirada</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.espacoFinal} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4ff',
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dataBotao: {
    fontSize: 30,
    color: '#003AAA',
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  dataTexto: {
    fontSize: 22,
    marginHorizontal: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003AAA',
  },
  totalContainer: {
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  totalTexto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003AAA',
  },
  modoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  modoBotao: {
    backgroundColor: '#003AAA',
    padding: 10,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
  },
  modoTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  secaoContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003AAA',
    marginBottom: 10,
  },
  vacaContainer: {
    marginVertical: 10,
  },
  vacaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003AAA',
  },
  botoesTirada: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  registrarBotao: {
    backgroundColor: '#003AAA',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  registrarTexto: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  filtroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filtroIcono: {
    marginRight: 10,
  },
  filtroInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#003AAA',
    flex: 1,
    paddingVertical: 5,
  },
  espacoFinal: {
    height: 50,
  },
});

export default RegistrarTirada;
