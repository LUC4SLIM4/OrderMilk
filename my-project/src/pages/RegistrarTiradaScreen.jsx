import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function RegistrarTirada() {
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
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedCow, setSelectedCow] = useState(null);
  const [milkingSession, setMilkingSession] = useState(1);
  const [totalMilk, setTotalMilk] = useState('');
  const [bezerro, setBezerro] = useState('');
  const [descarte, setDescarte] = useState('');

  const incrementarData = (dias) => {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    setData(novaData);
  };

  const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR');
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

  const showPopup = (cow, session) => {
    setSelectedCow(cow);
    setMilkingSession(session);
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
    setTotalMilk('');
    setBezerro('');
    setDescarte('');
  };

  const handleSubmit = () => {
    console.log('Submitting data:', {
      date: formatarData(data),
      cow: selectedCow,
      session: milkingSession,
      totalMilk,
      bezerro,
      descarte,
      finalTotal: calculateFinalTotal()
    });
    hidePopup();
  };

  const calculateFinalTotal = () => {
    const total = parseFloat(totalMilk) || 0;
    const bezerroValue = parseFloat(bezerro) || 0;
    const descarteValue = parseFloat(descarte) || 0;
    return (total - bezerroValue - descarteValue).toFixed(2);
  };

  const renderizarVaca = ({ item }) => (
    <View style={styles.vacaContainer}>
      <Text style={styles.vacaNome}>{item.nome} - Brinco: {item.brinco}</Text>
      <View style={styles.botoesTirada}>
        {[1, 2, 3].map((session) => (
          <TouchableOpacity 
            key={session}
            style={styles.registrarBotao} 
            onPress={() => showPopup(item, session)}
          >
            <Text style={styles.registrarTexto}>Registrar {session}° Tirada</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={modoTirada === 'vaca' ? vacas.filter(v => v.brinco.includes(filtro)) : []}
        keyExtractor={(item) => item.id}
        renderItem={modoTirada === 'vaca' ? renderizarVaca : null}
        ListHeaderComponent={() => (
          <View>
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
              <TouchableOpacity
                style={[
                  styles.modoBotao,
                  modoTirada === 'vaca' ? styles.botaoSelecionado : styles.botaoNaoSelecionado,
                ]}
                onPress={() => setModoTirada('vaca')}
              >
                <Text
                  style={[
                    styles.modoTexto,
                    modoTirada === 'vaca' ? styles.textoSelecionado : styles.textoNaoSelecionado,
                  ]}
                >
                  Vaca a Vaca
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modoBotao,
                  modoTirada === 'todas' ? styles.botaoSelecionado : styles.botaoNaoSelecionado,
                ]}
                onPress={() => setModoTirada('todas')}
              >
                <Text
                  style={[
                    styles.modoTexto,
                    modoTirada === 'todas' ? styles.textoSelecionado : styles.textoNaoSelecionado,
                  ]}
                >
                  Todas de uma vez
                </Text>
              </TouchableOpacity>
            </View>

            {modoTirada === 'vaca' && (
              <View style={styles.filtroContainer}>
                <Ionicons name="search" size={20} color="#003AAA" style={styles.filtroIcono} />
                <TextInput
                  placeholder="Filtrar por brinco"
                  value={filtro}
                  onChangeText={setFiltro}
                  style={styles.filtroInput}
                />
              </View>
            )}

            {modoTirada === 'todas' && (
              <View style={styles.secaoContainer}>
                <Text style={styles.secaoTitulo}>Registrar Tiradas para Todas</Text>
                <View style={styles.botoesTirada}>
                  {[1, 2, 3].map((session) => (
                    <TouchableOpacity
                      key={session}
                      style={styles.registrarBotao}
                      onPress={() => showPopup(null, session)}
                    >
                      <Text style={styles.registrarTexto}>Registrar {session}° Tirada</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
        ListFooterComponent={<View style={styles.espacoFinal} />}
      />

      <Modal
        visible={isPopupVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Ordenha</Text>
            <Text style={styles.modalText}>Data: {formatarData(data)}</Text>
            {selectedCow && modoTirada === 'vaca' && (
              <Text style={styles.modalText}>Vaca: {selectedCow.nome} (Brinco: {selectedCow.brinco})</Text>
            )}
            <Text style={styles.modalText}>{milkingSession}° Ordenha</Text>

            <TextInput
              style={styles.input}
              placeholder="Total de Leite Produzido (L)"
              keyboardType="numeric"
              value={totalMilk}
              onChangeText={setTotalMilk}
            />
            <TextInput
              style={styles.input}
              placeholder="Bezerro(a) (L)"
              keyboardType="numeric"
              value={bezerro}
              onChangeText={setBezerro}
            />
            <TextInput
              style={styles.input}
              placeholder="Descarte (L)"
              keyboardType="numeric"
              value={descarte}
              onChangeText={setDescarte}
            />

            <Text style={styles.modalFinalTotal}>
              Total Final: {calculateFinalTotal()} Litros
            </Text>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={hidePopup}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    padding: 10,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
  },
  modoTexto: {
    fontWeight: 'bold',
  },
  botaoSelecionado: {
    backgroundColor: '#003AAA',
  },
  botaoNaoSelecionado: {
    backgroundColor: '#808080',
  },
  textoSelecionado: {
    color: '#ffffff',
  },
  textoNaoSelecionado: {
    color: '#fff',
  },
  secaoContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003AAA',
    marginBottom: 10,
  },
  vacaContainer: {
    marginVertical: 10,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
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
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
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
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filtroIcono: {
    marginRight: 10,
    color: '#003AAA',
  },
  filtroInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#003AAA',
    flex: 1,
    paddingVertical: 5,
    color: '#000',
  },
  espacoFinal: {
    height: 80,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003AAA',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#003AAA',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#003AAA',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#003AAA',
    fontSize: 16,
  },
});