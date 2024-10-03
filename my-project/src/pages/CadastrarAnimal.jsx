import React, { useState } from "react";
import {View,ScrollView,StyleSheet,TouchableOpacity,Text,Dimensions,} from "react-native";
import CustomInput from "../components/CadastrarAnimal/CustomInput";
import SelectBox from "../components/CadastrarAnimal/SelectBox";
import SubmitButton from "../components/CadastrarAnimal/SubmitButton";
import ModalSelector from "../modals/CadastrarAnimal/ModalSelector";
import DateSelectorModal from "../modals/CadastrarAnimal/DateSelectorModal";
import NameInputModal from "../modals/CadastrarAnimal/NameInputModal";
import MoreItemsModal from "../modals/CadastrarAnimal/MoreItemsModal";
import useForm from "../hooks/CadastrarAnimal/useForm";
import { showMessage } from 'react-native-flash-message'; 

const CadastrarAnimal = () => {
  const [formState, handleChange, resetForm] = useForm({
    brinco: "",
    nomeAnimal: "",
    raca: "",
    cor: "",
    pai: "",
    mae: "",
    dataNascimento: "",
    peso: "",
    genero: "",
    momentoReprodutivo: ""
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [nameInputModalVisible, setNameInputModalVisible] = useState(false);
  const [moreItemsModalVisible, setMoreItemsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [items, setItems] = useState({ coberturas: [], crias: [] });

  const options = {
    genero: ["Boi", "Vaca"],
    raca: ["Raça 1", "Raça 2", "Raça 3"],
    cor: ["Preto", "Branco", "Marrom"],
    momentoReprodutivo: ["Em Lactação", "Prenha", "Vazia"],
  };

  const validateForm = () => {
    const requiredFields = [
      'brinco', 
      'nomeAnimal', 
      'raca', 
      'cor', 
      'pai', 
      'mae', 
      'dataNascimento', 
      'peso', 
      'genero', 
      'momentoReprodutivo'
    ];
    
    for (const field of requiredFields) {
      if (!formState[field]) {
        showMessage({ message: `O campo ${field} é obrigatório.`, type: "danger" });
        return false;
      }
    }
    return true;
  };

  const handleSelect = (value) => {
    handleChange(currentField, value);
    setModalVisible(false);
  };

  const openModal = (field) => {
    setCurrentField(field);
    setModalVisible(true);
  };

  const handleDateSelect = (date) => {
    handleChange("dataNascimento", date.toLocaleDateString("pt-BR"));
    setDateModalVisible(false);
  };

  const handleNameInputConfirm = (name) => {
    setItems(prevState => ({
      ...prevState,
      [currentField]: [...prevState[currentField], name]
    }));
    setNameInputModalVisible(false);
  };

  const handleMoreItemsModal = (field) => {
    setCurrentField(field);
    setMoreItemsModalVisible(true);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    console.log("Dados do Animal Cadastrado:", formState);
    console.log("Coberturas:", items.coberturas);
    console.log("Crias:", items.crias);
    
    resetForm();
    setItems({ coberturas: [], crias: [] });
  };

  const handleItemEdit = (index, newValue) => {
    const updatedItems = [...items[currentField]];
    updatedItems[index] = newValue;
    setItems(prevState => ({
      ...prevState,
      [currentField]: updatedItems
    }));
  };

  const handleItemRemove = (index) => {
    const updatedItems = items[currentField].filter((_, i) => i !== index);
    setItems(prevState => ({
      ...prevState,
      [currentField]: updatedItems
    }));
  };

  const renderItems = (field) => {
    return items[field].slice(0, 3).map((item, index) => (
      <View key={index} style={styles.itemBox}>
        <Text>{item}</Text>
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.dateButtonText}>Data de Nascimento</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setDateModalVisible(true)}
          >
            <Text style={styles.dateText}>
              {formState.dataNascimento || "Toque Para Definir"}
            </Text>
          </TouchableOpacity>
          <SelectBox
            label="Gênero Bovino"
            value={formState.genero}
            onPress={() => openModal("genero")}
          />
          <CustomInput
            label="Nome do Animal"
            value={formState.nomeAnimal}
            onChangeText={(text) => handleChange("nomeAnimal", text)}
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
            onChangeText={(text) => handleChange("pai", text)}
            placeholder="Brinco do Pai"
            keyboardType="numeric"
          />
          <Text style={styles.sectionLabel}>Coberturas</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setCurrentField('coberturas');
              setNameInputModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>Adicionar Cobertura</Text>
          </TouchableOpacity>
          {renderItems('coberturas')}
          {items.coberturas.length > 0 && (
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => handleMoreItemsModal('coberturas')}
            >
              <Text style={styles.moreButtonText}>Mais</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.column}>
          <CustomInput
            label="Brinco do Animal"
            value={formState.brinco}
            onChangeText={(text) => handleChange("brinco", text)}
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
            onChangeText={(text) => handleChange("mae", text)}
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
            onChangeText={(text) => handleChange("peso", text)}
            placeholder="Peso"
            keyboardType="numeric"
          />
          <Text style={styles.sectionLabel}>Crias</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setCurrentField('crias');
              setNameInputModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>Adicionar Cria</Text>
          </TouchableOpacity>
          {renderItems('crias')}
          {items.crias.length > 0 && (
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => handleMoreItemsModal('crias')}
            >
              <Text style={styles.moreButtonText}>Mais</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <SubmitButton onPress={handleSubmit} />
      <ModalSelector
        visible={modalVisible}
        options={options[currentField]}
        onSelect={handleSelect}
        onClose={() => setModalVisible(false)}
      />
      <DateSelectorModal
        isVisible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onDateSelected={handleDateSelect}
      />
      <NameInputModal
        visible={nameInputModalVisible}
        onClose={() => setNameInputModalVisible(false)}
        onConfirm={handleNameInputConfirm}
      />
      <MoreItemsModal
        visible={moreItemsModalVisible}
        items={items[currentField]}
        onClose={() => setMoreItemsModalVisible(false)}
        onEdit={handleItemEdit}
        onRemove={handleItemRemove}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#FFF",
    justifyContent: "flex-start",
  },
  row: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
  },
  dateButton: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#003AAA',
    textAlign: 'center',
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 30,
    color: '#003AAA',
    textAlign: 'center',
  },
  itemBox: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#003AAA",
    padding: '5%',
    borderRadius: 5,
    alignItems: "center",

  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  moreButton: {
    backgroundColor: "#003AAA",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  moreButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default CadastrarAnimal;