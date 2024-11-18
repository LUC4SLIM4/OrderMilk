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
} from 'react-native';
import { database } from '../config/firebaseConfig';
import { ref, onValue, push, set } from 'firebase/database';

export default function ManejoSanitario() {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [newDisease, setNewDisease] = useState({ description: '', date: '' });
  const [newTreatment, setNewTreatment] = useState({
    disease: '',
    medication: '',
    interval: '',
    applications: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const animaisRef = ref(database, 'animais');
    const unsubscribe = onValue(animaisRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const animalsList = Object.entries(data).map(([id, animal]) => ({
          id,
          ...animal,
        }));
        setAnimals(animalsList);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        animal.nomeAnimal.toLowerCase().includes(searchLower) ||
        animal.brinco.toLowerCase().includes(searchLower) ||
        animal.momentoReprodutivo.toLowerCase().includes(searchLower)
      );
    });
  }, [animals, searchQuery]);

  const handleSaveDisease = () => {
    if (selectedAnimal && newDisease.description && newDisease.date) {
      const diseaseRef = ref(database, `diseases/${selectedAnimal.id}`);
      push(diseaseRef, newDisease);
      setShowDiseaseModal(false);
      setNewDisease({ description: '', date: '' });
    }
  };

  const handleSaveTreatment = () => {
    if (selectedAnimal && newTreatment.disease) {
      const treatmentRef = ref(database, `treatments/${selectedAnimal.id}`);
      push(treatmentRef, newTreatment);
      setShowTreatmentModal(false);
      setNewTreatment({ disease: '', medication: '', interval: '', applications: '' });
    }
  };

  const handleSaveChanges = () => {
    if (selectedAnimal) {
      const animalRef = ref(database, `animais/${selectedAnimal.id}`);
      set(animalRef, {
        ...selectedAnimal,
        diseases,
        treatments,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setShowAnimalModal(true)}>
          {selectedAnimal ? (
            <View style={styles.selectedAnimalInfo}>
              <Text style={styles.selectedAnimalName}>{selectedAnimal.nomeAnimal}</Text>
              <Text style={styles.selectedAnimalDetails}>Brinco: {selectedAnimal.brinco} | MR: {selectedAnimal.momentoReprodutivo}</Text>
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
          {diseases.map((disease, index) => (
            <View key={index} style={styles.listItem}>
              <Text>{`${disease.description} - ${disease.date}`}</Text>
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
                  <Text style={styles.animalName}>{animal.nomeAnimal}</Text>
                  <Text style={styles.animalDetails}>Brinco: {animal.brinco}</Text>
                  <Text style={styles.animalDetails}>MR: {animal.momentoReprodutivo}</Text>
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
            <TextInput
              style={styles.input}
              placeholder="Descrição da Doença"
              value={newDisease.description}
              onChangeText={(text) => setNewDisease({ ...newDisease, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Data"
              value={newDisease.date}
              onChangeText={(text) => setNewDisease({ ...newDisease, date: text })}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveDisease}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowDiseaseModal(false)}>
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
                  onPress={() => setNewTreatment({ ...newTreatment, disease: disease.description })}
                >
                  <Text>{disease.description}</Text>
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