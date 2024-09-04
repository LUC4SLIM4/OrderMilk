import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import CustomInput from "../components/CadastrarAnimal/CustomInput";
import SelectBox from "../components/CadastrarAnimal/SelectBox";
import SubmitButton from "../components/CadastrarAnimal/SubmitButton";
import ModalSelector from "../modals/CadastrarAnimal/ModalSelector";
import DateSelectorModal from "../modals/CadastrarAnimal/DateSelectorModal";
import useForm from "../hooks/CadastrarAnimal/useForm";

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
    handleChange(selectedField, value);
    setModalVisible(false);
  };

  const openModal = (field) => {
    setSelectedField(field);
    setModalVisible(true);
  };

  const handleDateSelect = (date) => {
    handleChange("dataNascimento", date.toLocaleDateString("pt-BR"));
    setDateModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Dados do Animal Cadastrado:", formState);
    resetForm();
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
        </View>
      </View>
      <SubmitButton onPress={handleSubmit} />
      <ModalSelector
        visible={modalVisible}
        options={options[selectedField]}
        onSelect={handleSelect}
        onClose={() => setModalVisible(false)}
      />
      <DateSelectorModal
        isVisible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onDateSelected={handleDateSelect}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
    justifyContent: "space-between",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  column: { flex: 2, marginHorizontal: 8 },
  dateButton: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20, // Espaço inferior para alinhar com outros elementos
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#003AAA",
    textAlign: "left", // Alinha o texto à esquerda
  },
  dateText: { fontSize: 16, color: "#333" },
});

export default CadastrarAnimal;
