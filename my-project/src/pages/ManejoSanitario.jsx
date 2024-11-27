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
import { ref, onValue, set, remove, get } from 'firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Trash2 } from 'lucide-react-native';

export default function ManejoSanitario() {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [predefinedDiseases, setPredefinedDiseases] = useState([]);
  const [treatments, setTreatments] = useState({});
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [showDiseaseSelectionModal, setShowDiseaseSelectionModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [newDisease, setNewDisease] = useState({ nome: '', descricao: '', data: new Date() });
  const [newTreatment, setNewTreatment] = useState({
    doencaNome: '',
    medicamento: '',
    intervalo: '',
    quantidade: '',
    data: new Date(),
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
      fetchDiseases(selectedAnimal.id).then(setDiseases);
    } else {
      setDiseases([]);
    }
  }, [selectedAnimal]);

  useEffect(() => {
    if (selectedAnimal && diseases.length > 0) {
      const fetchAllTreatments = async () => {
        const allTreatments = {};
        for (const disease of diseases) {
          const diseaseTreatments = await fetchTreatments(selectedAnimal.id, disease.nome);
          allTreatments[disease.nome] = diseaseTreatments;
        }
        setTreatments(allTreatments);
      };
      fetchAllTreatments();
    } else {
      setTreatments({});
    }
  }, [selectedAnimal, diseases]);

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

  const saveDisease = async (animalId, disease) => {
    const diseaseRef = ref(database, `doencas/${animalId}/${disease.nome}`);
    await set(diseaseRef, disease);
  };

  const saveTreatment = async (animalId, diseaseName, treatment) => {
    const treatmentRef = ref(database, `doencas/${animalId}/${diseaseName}/tratamentos/${treatment.medicamento}`);
    await set(treatmentRef, treatment);
  };

  const deleteDisease = async (animalId, diseaseName) => {
    const diseaseRef = ref(database, `doencas/${animalId}/${diseaseName}`);
    await remove(diseaseRef);
  };

  const deleteTreatment = async (animalId, diseaseName, medicamento) => {
    const treatmentRef = ref(database, `doencas/${animalId}/${diseaseName}/tratamentos/${medicamento}`);
    await remove(treatmentRef);
  };

  const fetchDiseases = async (animalId) => {
    const diseasesRef = ref(database, `doencas/${animalId}`);
    const snapshot = await get(diseasesRef);
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([nome, data]) => ({
        id: nome,
        ...data,
      }));
    }
    return [];
  };

  const fetchTreatments = async (animalId, diseaseName) => {
    const treatmentsRef = ref(database, `doencas/${animalId}/${diseaseName}/tratamentos`);
    const snapshot = await get(treatmentsRef);
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([medicamento, data]) => ({
        id: medicamento,
        ...data,
      }));
    }
    return [];
  };

  const handleSaveDisease = async () => {
    if (selectedAnimal && newDisease.nome && newDisease.descricao) {
      try {
        await saveDisease(selectedAnimal.id, {
          ...newDisease,
          data: newDisease.data.toISOString(),
        });
        setDiseases(prevDiseases => [...prevDiseases, { id: newDisease.nome, ...newDisease }]);
        setShowDiseaseModal(false);
        setNewDisease({ nome: '', descricao: '', data: new Date() });
      } catch (error) {
        console.error("Error saving disease:", error);
        Alert.alert("Erro", "Não foi possível salvar a doença. Tente novamente.");
      }
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
    }
  };

  const handleDeleteDisease = (diseaseName) => {
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
          onPress: async () => {
            if (selectedAnimal) {
              try {
                await deleteDisease(selectedAnimal.id, diseaseName);
                setDiseases(prevDiseases => prevDiseases.filter(disease => disease.id !== diseaseName));
              } catch (error) {
                console.error("Error deleting disease:", error);
                Alert.alert("Erro", "Não foi possível excluir a doença. Tente novamente.");
              }
            }
          }
        }
      ]
    );
  };

  const handleSaveTreatment = async () => {
    if (selectedAnimal && newTreatment.doencaNome && newTreatment.medicamento && newTreatment.intervalo && newTreatment.quantidade) {
      try {
        await saveTreatment(selectedAnimal.id, newTreatment.doencaNome, {
          ...newTreatment,
          data: newTreatment.data.toISOString(),
        });
        setTreatments(prevTreatments => ({
          ...prevTreatments,
          [newTreatment.doencaNome]: [
            ...(prevTreatments[newTreatment.doencaNome] || []),
            { id: newTreatment.medicamento, ...newTreatment },
          ],
        }));
        setShowTreatmentModal(false);
        setNewTreatment({ doencaNome: '', medicamento: '', intervalo: '', quantidade: '', data: new Date() });
      } catch (error) {
        console.error("Error saving treatment:", error);
        Alert.alert("Erro", "Não foi possível salvar o tratamento. Tente novamente.");
      }
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos do tratamento.");
    }
  };

  const handleSaveChanges = async () => {
    if (selectedAnimal) {
      try {
        const doencasRef = ref(database, `doencas/${selectedAnimal.id}`);
        
        // Prepare the data structure
        const doencasData = {};

        // Add diseases and treatments
        diseases.forEach((disease) => {
          doencasData[disease.nome] = {
            nome: disease.nome,
            descricao: disease.descricao,
            data: disease.data,
            tratamentos: {}
          };

          const diseaseTreatments = treatments[disease.nome] || [];
          diseaseTreatments.forEach((treatment) => {
            doencasData[disease.nome].tratamentos[treatment.medicamento] = {
              medicamento: treatment.medicamento,
              intervalo: treatment.intervalo,
              quantidade: treatment.quantidade,
              data: treatment.data
            };
          });
        });

        console.log('Saving data:', JSON.stringify(doencasData, null, 2));

        // Use set to replace all data for this animal's diseases
        await set(doencasRef, doencasData);

        console.log('Data saved successfully');
        Alert.alert("Sucesso", "Alterações salvas com sucesso no banco de dados.");
      } catch (error) {
        console.error("Erro ao salvar alterações:", error);
        Alert.alert("Erro", "Não foi possível salvar as alterações. Tente novamente.");
      }
    } else {
      Alert.alert("Erro", "Por favor, selecione um animal antes de salvar as alterações.");
    }
  };

  const handleDeleteTreatment = (diseaseName, medicamento) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este tratamento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            if (selectedAnimal) {
              try {
                await deleteTreatment(selectedAnimal.id, diseaseName, medicamento);
                setTreatments(prevTreatments => ({
                  ...prevTreatments,
                  [diseaseName]: prevTreatments[diseaseName].filter(t => t.medicamento !== medicamento)
                }));
              } catch (error) {
                console.error("Error deleting treatment:", error);
                Alert.alert("Erro", "Não foi possível excluir o tratamento. Tente novamente.");
              }
            }
          }
        }
      ]
    );
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
                <Text style={styles.listItemTitle}>{disease.nome}</Text>
                <Text>{disease.descricao}</Text>
                <Text style={styles.listItemDate}>{formatDate(new Date(disease.data))}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteDisease(disease.nome)}
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
          {diseases.map((disease) => (
            <View key={disease.id}>
              <Text style={styles.diseaseTitle}>{disease.nome}</Text>
              {treatments[disease.nome] && treatments[disease.nome].length > 0 ? (
                treatments[disease.nome].map((treatment, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.listItemContent}>
                      <Text>{`${treatment.medicamento} / ${treatment.intervalo} / ${treatment.quantidade} Aplicações`}</Text>
                      <Text style={styles.listItemDate}>{formatDate(new Date(treatment.data))}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteTreatment(disease.nome, treatment.medicamento)}
                    >
                      <Trash2 size={24} color="#FF0000" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noTreatmentText}>Ainda não possui tratamento registrado</Text>
              )}
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
                {newDisease.nome ? (
                  <View style={styles.selectedDiseaseInfo}>
                    <Text style={styles.selectedDiseaseName}>{newDisease.nome}</Text>
                  </View>
                ) : (
                  <Text style={styles.selectDiseaseText}>Selecione a Doença</Text>
                )}
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Descrição da Doença"
              value={newDisease.descricao}
              onChangeText={(text) => setNewDisease({ ...newDisease, descricao: text })}
            />
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{formatDate(newDisease.data)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newDisease.data}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewDisease({ ...newDisease, data: selectedDate });
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
                    setNewDisease({ ...newDisease, nome: disease });
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
            <View style={styles.card}>
              <TouchableOpacity onPress={() => setShowDiseaseSelectionModal(true)}>
                {newTreatment.doencaNome ? (
                  <View style={styles.selectedDiseaseInfo}>
                    <Text style={styles.selectedDiseaseName}>{newTreatment.doencaNome}</Text>
                  </View>
                ) : (
                  <Text style={styles.selectDiseaseText}>Selecione a Doença</Text>
                )}
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Medicamento/Vacina"
              value={newTreatment.medicamento}
              onChangeText={(text) => setNewTreatment({ ...newTreatment, medicamento: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Intervalo de Aplicações"
              value={newTreatment.intervalo}
              onChangeText={(text) => setNewTreatment({ ...newTreatment, intervalo: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade de Aplicações"
              value={newTreatment.quantidade}
              onChangeText={(text) => setNewTreatment({ ...newTreatment, quantidade: text })}
            />
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{formatDate(newTreatment.data)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newTreatment.data}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewTreatment({ ...newTreatment, data: selectedDate });
                  }
                }}
              />
            )}
            <TouchableOpacity style={styles.button} onPress={handleSaveTreatment}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowTreatmentModal(false)}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showDiseaseSelectionModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Doença</Text>
            <ScrollView style={styles.diseaseList}>
              {diseases.map((disease, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.diseaseItem}
                  onPress={() => {
                    setNewTreatment({ ...newTreatment, doencaNome: disease.nome });
                    setShowDiseaseSelectionModal(false);
                  }}
                >
                  <Text style={styles.diseaseName}>{disease.nome}</Text>
                  <Text style={styles.diseaseDescription}>{disease.descricao}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowDiseaseSelectionModal(false)}>
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
  diseaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  diseaseDescription: {
    fontSize: 14,
    color: '#666',
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
  diseaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  noTreatmentText: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 8,
  },
});

