import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { database } from '../config/firebaseConfig';
import { ref, push } from 'firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ControleReprodutivo = () => {
  const [eventType, setEventType] = useState('cobertura');
  const [animalId, setAnimalId] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [bullId, setBullId] = useState('');
  const [semenDose, setSemenDose] = useState('');
  const [calfId, setCalfId] = useState('');
  const [calfGender, setCalfGender] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDateChange = (selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleSave = async () => {
    try {
      const eventData = {
        type: eventType,
        animalId,
        date: date.toISOString(),
        notes,
      };

      if (eventType === 'cobertura' || eventType === 'inseminacao') {
        eventData.bullId = bullId;
        if (eventType === 'inseminacao') {
          eventData.semenDose = semenDose;
        }
      } else if (eventType === 'parto') {
        eventData.calfId = calfId;
        eventData.calfGender = calfGender;
      }

      const eventsRef = ref(database, 'eventos_reprodutivos');
      await push(eventsRef, eventData);

      Alert.alert('Sucesso', 'Evento reprodutivo registrado com sucesso!');
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      Alert.alert('Erro', 'Não foi possível salvar o evento. Tente novamente.');
    }
  };

  const resetForm = () => {
    setEventType('cobertura');
    setAnimalId('');
    setDate(new Date());
    setNotes('');
    setBullId('');
    setSemenDose('');
    setCalfId('');
    setCalfGender('');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Controle Reprodutivo</Text>

        <Text style={styles.label}>Tipo de Evento</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.pickerButtonText}>{eventType}</Text>
          <Ionicons name="chevron-down" size={24} color="#003AAA" />
        </TouchableOpacity>

        <Text style={styles.label}>ID do Animal</Text>
        <TextInput
          style={styles.input}
          value={animalId}
          onChangeText={setAnimalId}
          placeholder="Digite o ID do animal"
        />

        <Text style={styles.label}>Data do Evento</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
          <Ionicons name="calendar" size={24} color="#003AAA" />
        </TouchableOpacity>

        {(eventType === 'cobertura' || eventType === 'inseminacao') && (
          <View>
            <Text style={styles.label}>ID do Touro / Sêmen</Text>
            <TextInput
              style={styles.input}
              value={bullId}
              onChangeText={setBullId}
              placeholder="Digite o ID do touro ou sêmen"
            />
          </View>
        )}

        {eventType === 'inseminacao' && (
          <View>
            <Text style={styles.label}>Dose de Sêmen</Text>
            <TextInput
              style={styles.input}
              value={semenDose}
              onChangeText={setSemenDose}
              placeholder="Digite a dose de sêmen"
            />
          </View>
        )}

        {eventType === 'parto' && (
          <View>
            <Text style={styles.label}>ID da Cria</Text>
            <TextInput
              style={styles.input}
              value={calfId}
              onChangeText={setCalfId}
              placeholder="Digite o ID da cria"
            />
            <Text style={styles.label}>Sexo da Cria</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.pickerButtonText}>{calfGender || 'Selecione o sexo'}</Text>
              <Ionicons name="chevron-down" size={24} color="#003AAA" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Digite observações adicionais"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDateChange}
        onCancel={() => setShowDatePicker(false)}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Tipo de Evento</Text>
            <Picker
              selectedValue={eventType}
              onValueChange={(itemValue) => {
                setEventType(itemValue);
                setIsModalVisible(false);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Cobertura" value="cobertura" />
              <Picker.Item label="Inseminação Artificial" value="inseminacao" />
              <Picker.Item label="Parto" value="parto" />
            </Picker>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
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
    backgroundColor: '#f0f4ff',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003AAA',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003AAA',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#000',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#003AAA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003AAA',
    marginBottom: 10,
    textAlign: 'center',
  },
  picker: {
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#003AAA',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ControleReprodutivo;
 
