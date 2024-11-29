import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { database } from '../config/firebaseConfig';
import { ref, onValue, push, set } from 'firebase/database';

const GestaoNutritiva = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedMomento, setSelectedMomento] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [dietaAtual, setDietaAtual] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [filterType, setFilterType] = useState(''); // 'vaca' or 'grupo'

  const momentosReprodutivos = [
    'Pré-Parto', 'Pós-Parto', 'Lactação Inicial', 'Lactação Média', 
    'Lactação Final', 'Período Seco', 'Crescimento', 'Manutenção'
  ];

  const insumos = [
    { id: '1', nome: 'Silagem de milho', unidade: 'kg' },
    { id: '2', nome: 'Ração concentrada', unidade: 'kg' },
    { id: '3', nome: 'Farelo de soja', unidade: 'kg' },
    { id: '4', nome: 'Feno', unidade: 'kg' },
    { id: '5', nome: 'Suplemento mineral', unidade: 'g' },
  ];

  useEffect(() => {
    const animaisRef = ref(database, 'animais');
    onValue(animaisRef, (snapshot) => {
      const data = snapshot.val();
      const animaisList = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
      setAnimais(animaisList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching animals:", error);
      setLoading(false);
    });
  }, []);

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const adicionarInsumo = (insumo) => {
    setDietaAtual([...dietaAtual, { ...insumo, quantidade: 0 }]);
  };

  const atualizarQuantidade = (id, quantidade) => {
    setDietaAtual(dietaAtual.map(item => 
      item.id === id ? { ...item, quantidade: parseFloat(quantidade) || 0 } : item
    ));
  };

  const enviarDieta = () => {
    if ((!selectedAnimal && !selectedMomento) || dietaAtual.length === 0) {
      alert('Por favor, selecione uma vaca ou um grupo, e adicione insumos à dieta.');
      return;
    }

    const dietaRef = ref(database, 'dietas');
    const novaDieta = {
      tipo: filterType,
      ...(filterType === 'vaca' ? {
        animalId: selectedAnimal.id,
        animalNome: selectedAnimal.nomeAnimal,
      } : {
        grupo: selectedMomento,
      }),
      dataInicio: startDate.toISOString().split('T')[0],
      dataFim: endDate.toISOString().split('T')[0],
      insumos: dietaAtual.map(item => ({
        id: item.id,
        nome: item.nome,
        quantidade: item.quantidade,
        unidade: item.unidade
      }))
    };

    push(dietaRef, novaDieta)
      .then(() => {
        alert('Dieta enviada com sucesso!');
        setDietaAtual([]);
      })
      .catch((error) => {
        console.error('Erro ao enviar dieta:', error);
        alert('Erro ao enviar dieta. Por favor, tente novamente.');
      });
  };

  const renderFilterContent = () => {
    if (!filterType) {
      return (
        <>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setFilterType('vaca')}
          >
            <Text style={styles.filterOptionText}>Vaca</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setFilterType('grupo')}
          >
            <Text style={styles.filterOptionText}>Grupo</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (filterType === 'vaca') {
      return (
        <FlatList
          data={animais}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setSelectedAnimal(item);
                setSelectedMomento('');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.modalItemText}>{item.nomeAnimal} - Brinco: {item.brinco}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }

    if (filterType === 'grupo') {
      return (
        <>
          {momentosReprodutivos.map((momento, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalItem}
              onPress={() => {
                setSelectedMomento(momento);
                setSelectedAnimal(null);
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.modalItemText}>{momento}</Text>
            </TouchableOpacity>
          ))}
        </>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003AAA" />
        <Text style={styles.loadingText}>Carregando animais...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filtros</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {
            setFilterType('');
            setFilterModalVisible(true);
          }}
        >
          <Text style={styles.selectButtonText}>
            {selectedAnimal 
              ? `Vaca: ${selectedAnimal.nomeAnimal}`
              : selectedMomento
                ? `Grupo: ${selectedMomento}`
                : 'Selecionar Vaca ou Grupo'}
          </Text>
          <Icon name="chevron-down" size={20} color="#003AAA" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Período da Dieta</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Icon name="calendar" size={20} color="#003AAA" />
          <Text style={styles.dateText}>Início: {startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onChangeStartDate}
          />
        )}
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Icon name="calendar" size={20} color="#003AAA" />
          <Text style={styles.dateText}>Fim: {endDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onChangeEndDate}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Composição da Dieta</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Adicionar Insumo</Text>
        </TouchableOpacity>
        {dietaAtual.map((item, index) => (
          <View key={index} style={styles.dietaItem}>
            <Text style={styles.dietaItemText}>{item.nome}</Text>
            <TextInput
              style={styles.quantidadeInput}
              keyboardType="numeric"
              value={item.quantidade.toString()}
              onChangeText={(text) => atualizarQuantidade(item.id, text)}
              placeholder="Qtd"
            />
            <Text style={styles.unidadeText}>{item.unidade}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.enviarButton} onPress={enviarDieta}>
        <Text style={styles.enviarButtonText}>Enviar Dieta</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Selecione o Insumo</Text>
          {insumos.map((insumo) => (
            <TouchableOpacity
              key={insumo.id}
              style={styles.modalItem}
              onPress={() => {
                adicionarInsumo(insumo);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalItemText}>{insumo.nome}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => {
          setFilterType('');
          setFilterModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {!filterType 
              ? 'Selecione o Tipo de Filtro'
              : filterType === 'vaca'
                ? 'Selecione a Vaca'
                : 'Selecione o Grupo'}
          </Text>
          {renderFilterContent()}
          {filterType && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setFilterType('');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.closeButtonText}>Voltar</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: '#003AAA',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#003AAA',
  },
  section: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003AAA',
    marginBottom: 10,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6eeff',
    padding: 10,
    borderRadius: 10,
  },
  selectButtonText: {
    color: '#003AAA',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#003AAA',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dietaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dietaItemText: {
    flex: 1,
    color: '#003AAA',
  },
  quantidadeInput: {
    borderWidth: 1,
    borderColor: '#003AAA',
    borderRadius: 5,
    padding: 5,
    width: 60,
    marginRight: 10,
  },
  unidadeText: {
    width: 30,
    color: '#003AAA',
  },
  enviarButton: {
    backgroundColor: '#003AAA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  enviarButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003AAA',
  },
  modalItem: {
    backgroundColor: '#e6eeff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
  },
  modalItemText: {
    color: '#003AAA',
  },
  closeButton: {
    backgroundColor: '#003AAA',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#003AAA',
  },
  filterOption: {
    backgroundColor: '#e6eeff',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  filterOptionText: {
    color: '#003AAA',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GestaoNutritiva;

