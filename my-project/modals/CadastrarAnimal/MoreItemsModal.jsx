import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

const MoreItemsModal = ({ visible, items, onClose, onItemEdit, onItemRemove }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedValue, setEditedValue] = useState("");

  const handleEdit = (item, index) => {
    setEditingIndex(index);
    setEditedValue(item);
  };

  const handleSave = () => {
    if (editingIndex !== null && editedValue.trim() !== "") {
      onItemEdit(editingIndex, editedValue);
      setEditingIndex(null);
      setEditedValue("");
    }
  };

  const handleRemove = (index) => {
    onItemRemove(index);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Mais Itens</Text>
          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.itemContainer}>
                {editingIndex === index ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.editInput}
                      value={editedValue}
                      onChangeText={setEditedValue}
                      placeholder="Digite o novo valor"
                    />
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSave}
                    >
                      <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.itemText}>{item}</Text>
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEdit(item, index)}
                      >
                        <Text style={styles.editButtonText}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemove(index)}
                      >
                        <Text style={styles.removeButtonText}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#003AAA",
  },
  itemContainer: {
    width: "100%",
    paddingVertical: 10,
  },
  itemTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  itemText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#003AAA",
    padding: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#003AAA",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: "#003AAA",
    padding: 5,
    width: 80,
    height: 30,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: "#FF0000",
    padding: 5,
    width: 80,
    height: 30,
    marginLeft: 10,
  },
  removeButtonText: {
    color: "#FFF",
    fontSize: 14,
  },
});

export default MoreItemsModal;
