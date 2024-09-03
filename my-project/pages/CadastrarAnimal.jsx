import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import CustomInput from "../components/CadastrarAnimal/CustomInput";
import SelectBox from "../components/CadastrarAnimal/SelectBox";
import SubmitButton from "../components/CadastrarAnimal/SubmitButton";
import ModalSelector from "../modals/CadastrarAnimal/ModalSelector";
import DateSelectorModal from "../modals/CadastrarAnimal/DateSelectorModal";

const CadastrarAnimal = () => {
  const [formState, setFormState] = useState({
    brinco: "",
    nomeAnimal: "",
    raca: "",
    cor: "",
    pai: "",
    mae: "",
    dataNascimento: "",
    peso: "",
    genero: "",
    momentoReprodutivo: "",
  });
  const [selectedField, setSelectedField] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const options = {
    genero: ["Boi", "Vaca"],
    raca: ["Raça 1", "Raça 2", "Raça 3"],
    cor: ["Preto", "Branco", "Marrom"],
    momentoReprodutivo: ["Em Lactação", "Prenha", "Vazia"],
  };

  const handleSelect = (value) => {
    setFormState((prevState) => ({
      ...prevState,
      [selectedField]: value,
    }));
    setModalVisible(false);
  };

  const openModal = (field) => {
    setSelectedField(field);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleDateSelect = (date) => {
    setFormState((prevState) => ({
      ...prevState,
      dataNascimento: date.toLocaleDateString('pt-BR'),
    }));
    setDateModalVisible(false);
  };

  const openDateModal = () => {
    setDateModalVisible(true);
  };

  const closeDateModal = () => {
    setDateModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Dados do Animal Cadastrado:", formState);
    setFormState({
      brinco: "",
      nomeAnimal: "",
      raca: "",
      cor: "",
      pai: "",
      mae: "",
      dataNascimento: "",
      peso: "",
      genero: "",
      momentoReprodutivo: "",
    });
  };

  useEffect(() => {
    return () => {
      setFormState({
        brinco: "",
        nomeAnimal: "",
        raca: "",
        cor: "",
        pai: "",
        mae: "",
        dataNascimento: "",
        peso: "",
        genero: "",
        momentoReprodutivo: "",
      });
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <SelectBox
            label="Gênero Bovino"
            value={formState.genero}
            onPress={() => openModal("genero")}
          />
          <CustomInput
            label="Nome do Animal"
            value={formState.nomeAnimal}
            onChangeText={(text) => setFormState(prev => ({ ...prev, nomeAnimal: text }))}
            placeholder="Nome do Animal"
          />
          <SelectBox
            label="Raça"
            value={formState.raca}
            onPress={() => openModal("raca")}
          />
          <CustomInput
            label="Brinco do Pai"
            value={formState.pai}
            onChangeText={(text) => setFormState(prev => ({ ...prev, pai: text }))}
            placeholder="Brinco do Pai"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.column}>
          <CustomInput
            label="Brinco do Animal"
            value={formState.brinco}
            onChangeText={(text) => setFormState(prev => ({ ...prev, brinco: text }))}
            placeholder="Brinco do Animal"
            keyboardType="numeric"
          />
          <SelectBox
            label="Cor"
            value={formState.cor}
            onPress={() => openModal("cor")}
          />
          <CustomInput
            label="Brinco da Mãe"
            value={formState.mae}
            onChangeText={(text) => setFormState(prev => ({ ...prev, mae: text }))}
            placeholder="Brinco da Mãe"
            keyboardType="numeric"
          />
          <SelectBox
            label="Momento Reprodutivo"
            value={formState.momentoReprodutivo}
            onPress={() => openModal("momentoReprodutivo")}
          />
          <CustomInput
            label="Peso"
            value={formState.peso}
            onChangeText={(text) => setFormState(prev => ({ ...prev, peso: text }))}
            placeholder="Peso"
            keyboardType="numeric"
          />
          <Text style={styles.dateButtonText}>Data de Nascimento</Text>
          <TouchableOpacity style={styles.dateButton} onPress={openDateModal}>
            <Text style={styles.dateText}>
              {formState.dataNascimento || "Toque Para Definir"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <SubmitButton onPress={handleSubmit} />
      <ModalSelector
        visible={modalVisible}
        options={options[selectedField]}
        onSelect={handleSelect}
        onClose={closeModal}
      />
      <DateSelectorModal
        isVisible={dateModalVisible}
        onClose={closeDateModal}
        onDateSelected={handleDateSelect}
      />
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
  dateButton: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#003AAA',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CadastrarAnimal;
