import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { database } from '../config/firebaseConfig';
import { ref, onValue, set, query, orderByChild, equalTo } from 'firebase/database';

export default function RegistrarTirada() {
  const [data, setData] = useState(new Date());
  const [modoTirada, setModoTirada] = useState(null);
  const [vacas, setVacas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedCow, setSelectedCow] = useState(null);
  const [milkingSession, setMilkingSession] = useState(1);
  const [totalMilk, setTotalMilk] = useState('');
  const [bezerro, setBezerro] = useState('');
  const [descarte, setDescarte] = useState('');
  const [totalDiario, setTotalDiario] = useState(0);

  useEffect(() => {
    const animaisRef = ref(database, 'animais');
    onValue(animaisRef, (snapshot) => {
      const data = snapshot.val();
      const animaisList = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
      setVacas(animaisList);
    });
  }, []);

  useEffect(() => {
    fetchTotalDiario();
  }, [data]);

  const fetchTotalDiario = () => {
    const dataFormatada = formatarDataParaChave(data);
    const ordenhasRef = ref(database, 'ordenhas');
    const ordenhasQuery = query(ordenhasRef, orderByChild('data'), equalTo(formatarData(data)));

    onValue(ordenhasQuery, (snapshot) => {
      const ordenhas = snapshot.val();
      if (ordenhas) {
        let total = 0;
        let todasDeUmaVez = false;

        Object.values(ordenhas).forEach((ordenha: any ) => {
          if (ordenha.brinco === 'todas') {
            todasDeUmaVez = true;
            total += ordenha.totalFinal;
          } else if (!todasDeUmaVez) {
            total += ordenha.totalFinal;
          }
        });

        setTotalDiario(total);
      } else {
        setTotalDiario(0);
      }
    });
  };

  const incrementarData = (dias) => {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    setData(novaData);
  };

  const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR');
  };

  const formatarDataParaChave = (data) => {
    return data.toISOString().split('T')[0].replace(/-/g, '');
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

  const calculateFinalTotal = () => {
    const total = parseFloat(totalMilk) || 0;
    const bezerroValue = parseFloat(bezerro) || 0;
    const descarteValue = parseFloat(descarte) || 0;
    return (total - bezerroValue - descarteValue).toFixed(2);
  };

  const handleSubmit = () => {
    const ordenhaRef = ref(database, 'ordenhas');
    const dataFormatada = formatarDataParaChave(data);
    const brinco = selectedCow ? selectedCow.brinco : 'todas';
    const chave = `${dataFormatada}_${milkingSession}_${brinco}`;

    const ordenhaData = {
      data: formatarData(data),
      ordenha: `${milkingSession}°`,
      totalProduzido: parseFloat(totalMilk) || 0,
      bezerro: parseFloat(bezerro) || 0,
      descarte: parseFloat(descarte) || 0,
      totalFinal: parseFloat(calculateFinalTotal())
    };

    if (modoTirada === 'vaca' && selectedCow) {
      ordenhaData.idAnimal = selectedCow.id;
      ordenhaData.nomeAnimal = selectedCow.nomeAnimal;
      ordenhaData.brinco = selectedCow.brinco;
    }

    set(ref(database, `ordenhas/${chave}`), ordenhaData)
      .then(() => {
        Alert.alert('Sucesso', 'Ordenha registrada com sucesso!');
        hidePopup();
        fetchTotalDiario();
      })
      .catch((error) => {
        console.error('Erro ao salvar ordenha:', error);
        Alert.alert('Erro', 'Não foi possível salvar a ordenha. Tente novamente.');
      });
  };

  const renderizarVaca = ({ item }) => (
    <View style={styles.vacaContainer}>
      <Text style={styles.vacaNome}>{item.nomeAnimal} - Brinco: {item.brinco}</Text>
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
              <Text style={styles.totalTexto}>Total de leite: {totalDiario.toFixed(2)} Litros</Text>
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
              <Text style={styles.modalText}>Vaca: {selectedCow.nomeAnimal} (Brinco: {selectedCow.brinco})</Text>
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
    padding:  15,
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
  modalFinalTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003AAA',
    marginTop: 10,
    marginBottom: 20,
  },
});