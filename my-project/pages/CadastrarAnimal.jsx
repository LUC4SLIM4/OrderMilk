import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CadastrarAnimal = () => {
  const [brinco, setBrinco] = useState('');
  const [nomeAnimal, setNomeAnimal] = useState('');
  const [raca, setRaca] = useState('');
  const [cor, setCor] = useState('');
  const [pai, setPai] = useState('');
  const [mae, setMae] = useState('');
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [peso, setPeso] = useState('');
  const [genero, setGenero] = useState('');
  const [momentoReprodutivo, setMomentoReprodutivo] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const options = {
    genero: ['Boi', 'Vaca'],
    raca: ['Raça 1', 'Raça 2', 'Raça 3'],
    cor: ['Preto', 'Branco', 'Marrom'],
    momentoReprodutivo: ['Em Lactação', 'Prenha', 'Vazia'],
  };

  const handleSelect = (value) => {
    switch (selectedField) {
      case 'genero':
        setGenero(value);
        break;
      case 'raca':
        setRaca(value);
        break;
      case 'cor':
        setCor(value);
        break;
      case 'momentoReprodutivo':
        setMomentoReprodutivo(value);
        break;
    }
    setModalVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);
    if (Platform.OS === 'android') {
      setShowDatePicker(false);  // Fecha o picker após a seleção no Android
      setDataNascimento(currentDate);  // Atualiza a data de nascimento com a data selecionada
    }
  };

  const confirmDate = () => {
    setDataNascimento(tempDate);
    setShowDatePicker(false);
  };

  const showDatePickerModal = () => {
    setTempDate(dataNascimento);
    setShowDatePicker(true);
  };

  const handleSubmit = () => {
    console.log('Cadastrar Animal:', {
      brinco,
      nomeAnimal,
      raca,
      cor,
      pai,
      mae,
      dataNascimento: dataNascimento.toLocaleDateString('pt-BR'), // Formata a data no formato brasileiro
      peso,
      genero,
      momentoReprodutivo,
    });

    setBrinco('');
    setNomeAnimal('');
    setRaca('');
    setCor('');
    setPai('');
    setMae('');
    setDataNascimento(new Date());
    setPeso('');
    setGenero('');
    setMomentoReprodutivo('');
  };

  const openModal = (field) => {
    setSelectedField(field);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Gênero Bovino</Text>
          <TouchableOpacity style={styles.selectBox} onPress={() => openModal('genero')}>
            <Text style={styles.selectText}>{genero ? genero : 'Toque Para Definir'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Nome do Animal</Text>
          <TextInput
            style={styles.input}
            value={nomeAnimal}
            onChangeText={setNomeAnimal}
            placeholder="Nome do Animal"
          />

          <Text style={styles.label}>Raça</Text>
          <TouchableOpacity style={styles.selectBox} onPress={() => openModal('raca')}>
            <Text style={styles.selectText}>{raca ? raca : 'Toque Para Definir'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Brinco do Pai</Text>
          <TextInput
            style={styles.input}
            value={pai}
            onChangeText={setPai}
            placeholder="Brinco do Pai"
          />

          <Text style={styles.label}>Data de Nascimento</Text>
          <TouchableOpacity style={styles.selectBox} onPress={showDatePickerModal}>
            <Text style={styles.selectText}>
              {dataNascimento.toLocaleDateString('pt-BR')}
            </Text>
          </TouchableOpacity>

          {/* Modal for DateTimePicker on iOS */}
          {Platform.OS === 'ios' && showDatePicker && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    style={styles.datePicker}
                  />
                  <TouchableOpacity style={styles.confirmButton} onPress={confirmDate}>
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {/* DateTimePicker for Android */}
          {Platform.OS !== 'ios' && showDatePicker && (
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <Text style={styles.label}>Coberturas</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Momento Reprodutivo</Text>
          <TouchableOpacity style={styles.selectBox} onPress={() => openModal('momentoReprodutivo')}>
            <Text style={styles.selectText}>{momentoReprodutivo ? momentoReprodutivo : 'Toque Para Definir'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Número do Brinco</Text>
          <TextInput
            style={styles.input}
            value={brinco}
            onChangeText={setBrinco}
            placeholder="Número do Brinco"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Cor</Text>
          <TouchableOpacity style={styles.selectBox} onPress={() => openModal('cor')}>
            <Text style={styles.selectText}>{cor ? cor : 'Toque Para Definir'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Brinco da Mãe</Text>
          <TextInput
            style={styles.input}
            value={mae}
            onChangeText={setMae}
            placeholder="Brinco da Mãe"
          />

          <Text style={styles.label}>Peso</Text>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            placeholder="Peso"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Crias</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Cadastrar Animal</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={options[selectedField]}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 2,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectText: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginRight: 8,
    width: '100%',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#003AAA',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
    width: '80%',
    marginTop: 'auto',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalCloseText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  datePicker: {
    width: '100%',
    backgroundColor: '#003AAA',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#003AAA',
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CadastrarAnimal;
