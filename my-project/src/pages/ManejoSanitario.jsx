import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { database } from '../config/firebaseConfig';
import { ref, onValue, push, set, remove } from 'firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Trash2 } from 'lucide-react-native';

export default function ManejoSanitario() {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [predefinedDiseases, setPredefinedDiseases] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [showDiseaseSelectionModal, setShowDiseaseSelectionModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [newDisease, setNewDisease] = useState({ name: '', description: '', date: new Date() });
  const [newTreatment, setNewTreatment] = useState({
    disease: '',
    medication: '',
    interval: '',
    applications: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [diseaseSearchQuery, setDiseaseSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const animaisRef = ref(database, 'animais');
    const unsubscribeAnimais = onValue(animaisRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const animalsList = Object.entries(data).map(([id, animal]) => ({
          id,
          ...animal,
        }));
        setAnimals(animalsList);
      }
    });

    const diseasesRef = ref(database, 'doenças');
    const unsubscribeDiseases = onValue(diseasesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const diseasesList = Object.values(data);
        setPredefinedDiseases(diseasesList);
      }
    });

    return () => {
      unsubscribeAnimais();
      unsubscribeDiseases();
    };
  }, []);

  useEffect(() => {
    if (selectedAnimal) {
      const diseasesRef = ref(database, `diseases/${selectedAnimal.id}`);
      const unsubscribe = onValue(diseasesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const diseasesList = Object.entries(data).map(([id, disease]) => ({
            id,
            ...disease,
          }));
          setDiseases(diseasesList);
        } else {
          setDiseases([]);
        }
      });

      return () => unsubscribe();
    } else {
      setDiseases([]);
    }
  }, [selectedAnimal]);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        animal.nomeAnimal.toLowerCase().includes(searchLower) ||
        animal.brinco.toLowerCase().includes(searchLower)
      );
    });
  }, [animals, searchQuery]);

  const filteredDiseases = useMemo(() => {
    return predefinedDiseases.filter((disease) => {
      const searchLower = diseaseSearchQuery.toLowerCase();
      return disease.toLowerCase().includes(searchLower);
    });
  }, [predefinedDiseases, diseaseSearchQuery]);

  const handleSaveDisease = () => {
    if (selectedAnimal && newDisease.name && newDisease.description) {
      const diseaseRef = ref(database, `diseases/${selectedAnimal.id}`);
      const newDiseaseWithId = {
        ...newDisease,
        id: Date.now().toString(),
        date: newDisease.date.toISOString(),
      };
      push(diseaseRef, newDiseaseWithId).then(() => {
        setDiseases(prevDiseases => [...prevDiseases, newDiseaseWithId]);
        setShowDiseaseModal(false);
        setNewDisease({ name: '', description: '', date: new Date() });
      }).catch(error => {
        console.error("Error saving disease:", error);
        Alert.alert("Erro", "Não foi possível salvar a doença. Tente novamente.");
      });
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
    }
  };

  const handleDeleteDisease = (diseaseId) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta doença?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            if (selectedAnimal) {
              const diseaseRef = ref(database, `diseases/${selectedAnimal.id}/${diseaseId}`);
              remove(diseaseRef).then(() => {
                setDiseases(prevDiseases => prevDiseases.filter(disease => disease.id !== diseaseId));
              }).catch(error => {
                console.error("Error deleting disease:", error);
                Alert.alert("Erro", "Não foi possível excluir a doença. Tente novamente.");
              });
            }
          }
        }
      ]
    );
  };

  const handleSaveTreatment = () => {
    if (selectedAnimal && newTreatment.disease && newTreatment.medication && newTreatment.interval && newTreatment.applications) {
      const treatmentRef = ref(database, `treatments/${selectedAnimal.id}`);
      push(treatmentRef, newTreatment).then(() => {
        setTreatments(prevTreatments => [...prevTreatments, newTreatment]);
        setShowTreatmentModal(false);
        setNewTreatment({ disease: '', medication: '', interval: '', applications: '' });
      }).catch(error => {
        console.error("Error saving treatment:", error);
        Alert.alert("Erro", "Não foi possível salvar o tratamento. Tente novamente.");
      });
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos do tratamento.");
    }
  };

  const handleSaveChanges = () => {
    if (selectedAnimal) {
      const animalRef = ref(database, `animais/${selectedAnimal.id}`);
      set(animalRef, {
        ...selectedAnimal,
        diseases,
        treatments,
      }).then(() => {
        Alert.alert("Sucesso", "Alterações salvas com sucesso.");
      }).catch(error => {
        console.error("Error saving changes:", error);
        Alert.alert("Erro", "Não foi possível salvar as alterações. Tente novamente.");
      });
    }
  };

  const formatDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      return date.toLocaleDateString('pt-BR');
    }
    return 'Data inválida';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setShowAnimalModal(true)}>
          {selectedAnimal ? (
            <View style={styles.selectedAnimalInfo}>
              <Text style={styles.selectedAnimalName}>{selectedAnimal.nomeAnimal} - Brinco: {selectedAnimal.brinco}</Text>
            </View>
          ) : (
            <Text style={styles.selectAnimalText}>Selecione o Animal</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Doenças</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setShowDiseaseModal(true)}>
          <Text style={styles.buttonText}>Registrar Doença</Text>
        </TouchableOpacity>
        <ScrollView style={styles.listContainer}>
          {diseases.map((disease) => (
            <View key={disease.id} style={styles.listItem}>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{disease.name}</Text>
                <Text>{disease.description}</Text>
                <Text style={styles.listItemDate}>{formatDate(new Date(disease.date))}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteDisease(disease.id)}
              >
                <Trash2 size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tratamentos</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setShowTreatmentModal(true)}>
          <Text style={styles.buttonText}>Registrar Tratamento</Text>
        </TouchableOpacity>
        <ScrollView style={styles.listContainer}>
          {treatments.map((treatment, index) => (
            <View key={index} style={styles.listItem}>
              <Text>{`${treatment.medication} / ${treatment.interval} / ${treatment.applications} Aplicações`}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <Modal visible={showAnimalModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar animal"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <ScrollView style={styles.animalList}>
              {filteredAnimals.map((animal) => (
                <TouchableOpacity
                  key={animal.id}
                  style={styles.animalItem}
                  onPress={() => {
                    setSelectedAnimal(animal);
                    setShowAnimalModal(false);
                  }}
                >
                  <Text style={styles.animalName}>{animal.nomeAnimal} - Brinco: {animal.brinco}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowAnimalModal(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showDiseaseModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Doença</Text>
            <View style={styles.card}>
              <TouchableOpacity onPress={() => setShowDiseaseSelectionModal(true)}>
                {newDisease.name ? (
                  <View style={styles.selectedDiseaseInfo}>
                    <Text style={styles.selectedDiseaseName}>{newDisease.name}</Text>
                  </View>
                ) : (
                  <Text style={styles.selectDiseaseText}>Selecione a Doença</Text>
                )}
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Descrição da Doença"
              value={newDisease.description}
              onChangeText={(text) => setNewDisease({ ...newDisease, description: text })}
            />
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{formatDate(newDisease.date)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newDisease.date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewDisease({ ...newDisease, date: selectedDate });
                  }
                }}
              />
            )}
            <TouchableOpacity style={styles.button} onPress={handleSaveDisease}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowDiseaseModal(false)}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showDiseaseSelectionModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Doença</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar doença"
              value={diseaseSearchQuery}
              onChangeText={setDiseaseSearchQuery}
            />
            <ScrollView style={styles.diseaseList}>
              {filteredDiseases.map((disease, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.diseaseItem}
                  onPress={() => {
                    setNewDisease({ ...newDisease, name: disease });
                    setShowDiseaseSelectionModal(false);
                  }}
                >
                  <Text>{disease}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowDiseaseSelectionModal(false)}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showTreatmentModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Tratamento</Text>
            <ScrollView style={styles.diseaseList}>
              {diseases.map((disease, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.diseaseItem}
                  onPress={() => setNewTreatment({ ...newTreatment, disease: disease.name })}
                >
                  <Text>{disease.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Medicamento/Vacina"
              value={newTreatment.medication}
              onChangeText={(text) => setNewTreatment({ ...newTreatment, medication: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Intervalo de Aplicações"
              value={newTreatment.interval}
              onChangeText={(text) => setNewTreatment({ ...newTreatment, interval: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade de Aplicações"
              value={newTreatment.applications}
              onChangeText={(text) => setNewTreatment({ ...newTreatment, applications: text })}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveTreatment}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowTreatmentModal(false)}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  selectedAnimalInfo: {
    flexDirection: 'column',
  },
  selectedAnimalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedAnimalDetails: {
    fontSize: 14,
    color: '#666',
  },
  selectAnimalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  selectedDiseaseInfo: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  selectedDiseaseName: {
    fontSize: 18,
    textAlign: 'center',
  },
  selectDiseaseText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#0047AB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    maxHeight: 150,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listItemDate: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#0047AB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  animalList: {
    maxHeight: 300,
  },
  animalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  animalName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  animalDetails: {
    fontSize: 14,
    color: '#666',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  diseaseList: {
    maxHeight: 150,
    marginBottom: 16,
  },
  diseaseItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});