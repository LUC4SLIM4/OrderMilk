import React, { useState } from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal'; // Certifique-se de ter instalado react-native-modal

const DateSelectorModal = ({ isVisible, onClose, onDateSelected }) => {
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(null); // Estado para armazenar a data temporária
  const [showPicker, setShowPicker] = useState(false);
  const [confirmButtonVisible, setConfirmButtonVisible] = useState(false);

  const handleConfirm = () => {
    if (tempDate) {
      setDate(tempDate); // Atualiza a data final
      onDateSelected(tempDate); // Passa a data final para o componente pai
    }
    setShowPicker(false);
    setConfirmButtonVisible(false);
    onClose();
  };

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setDate(selectedDate || date);
      handleConfirm();
    } else {
      setTempDate(selectedDate || date); // Armazena a data temporária
    }
  };

  const handleChooseDate = () => {
    setShowPicker(true);
    setConfirmButtonVisible(true);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Selecione a Data</Text>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={handleChooseDate}>
          <Text style={styles.buttonText}>Escolher Data</Text>
        </TouchableOpacity>
        {Platform.OS === 'ios' && confirmButtonVisible && (
          <>
            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
        {Platform.OS === 'android' && (
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#003AAA',
    padding: 10,
    borderRadius: 5,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default DateSelectorModal;
