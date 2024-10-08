import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importando o ícone
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Importando o DatePicker Modal

const ControleProducaoScreen = () => {
  const [data, setData] = useState(new Date());
  const [modoTirada, setModoTirada] = useState(null);
  const [vacas, setVacas] = useState([
    { id: '1', nome: 'Vaca 1', brinco: '123' },
    { id: '2', nome: 'Vaca 2', brinco: '124' },
  ]);
  const [filtro, setFiltro] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Estado para controlar a visibilidade do DatePicker

  const incrementarData = (dias) => {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    setData(novaData);
  };

  const formatarData = (data) => {
    const opcoes = { year: 'numeric', month: 'long', day: 'numeric', locale: 'pt-BR' };
    return data.toLocaleDateString('pt-BR', opcoes);
  };

  // Função para abrir o DatePicker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Função para fechar o DatePicker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Função para tratar a data selecionada
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
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <TouchableOpacity onPress={() => incrementarData(-1)}>
          <Text style={styles.dataBotao}>{'<'}</Text>
        </TouchableOpacity>
        
        {/* Ao clicar na data, o DatePicker será aberto */}
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
        locale="pt-BR" // Definindo o idioma do calendário para português
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
          {/* Campo de filtro com ícone */}
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
    </View>
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
    elevation: 3,
  },
  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003AAA',
    marginBottom: 10,
    textAlign: 'center',
  },
  filtroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#003AAA',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  filtroIcono: {
    marginRight: 10,
  },
  filtroInput: {
    flex: 1,
    padding: 5,
    fontSize: 16,
    color: '#003AAA',
  },
  vacaContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ffffff',
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
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
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  registrarTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ControleProducaoScreen;
