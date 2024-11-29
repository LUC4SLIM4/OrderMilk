import React, { useState, useEffect } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet, 
  Modal, 
  ScrollView,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ref, get } from 'firebase/database';
import { database } from '../../config/firebaseConfig';

const { width, height } = Dimensions.get('window');

const AnimalDetailModal = ({ isVisible, onClose, animalId }) => {
  const [animalDetails, setAnimalDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible && animalId) {
      const fetchAnimalDetails = async () => {
        try {
          const animalRef = ref(database, `animais/${animalId}`);
          const snapshot = await get(animalRef);
          if (snapshot.exists()) {
            setAnimalDetails(snapshot.val());
          }
          setLoading(false);
        } catch (error) {
          console.error("Erro ao buscar detalhes do animal:", error);
          setLoading(false);
        }
      };

      fetchAnimalDetails();
    }
  }, [isVisible, animalId]);

  if (!isVisible) return null;

  const renderMultipleItems = (items) => {
    if (!items || items.length === 0) return <Text>Nenhum</Text>;
    return items.map((item, index) => (
      <View key={index} style={styles.badge}>
        <Text style={styles.badgeText}>{item}</Text>
      </View>
    ));
  };

  const renderDetailItem = (label, value) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailText}>{typeof value === 'string' ? value : JSON.stringify(value)}</Text>
    </View>
  );

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Replace 'DataNascimento' with 'Data de Nascimento'
  const formatLabel = (key) => {
    return key === 'DataNascimento' ? 'Data de Nascimento' : capitalizeFirstLetter(key);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes do Animal</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Fechar detalhes">
              <Icon name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#003AAA" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : animalDetails ? (
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Informações Básicas</Text>
                {renderDetailItem("Brinco", animalDetails.brinco)}
                {renderDetailItem("Nome", animalDetails.nomeAnimal)}
                {renderDetailItem("Momento Reprodutivo", animalDetails.momentoReprodutivo)}
              </View>
              <View style={styles.separator} />
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Reprodução</Text>
                <Text style={styles.detailLabel}>Coberturas:</Text>
                <View style={styles.badgeContainer}>
                  {renderMultipleItems(animalDetails.coberturas)}
                </View>
                <Text style={styles.detailLabel}>Crias:</Text>
                <View style={styles.badgeContainer}>
                  {renderMultipleItems(animalDetails.crias)}
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Informações Adicionais</Text>
                {Object.entries(animalDetails)
                  .filter(([key]) => !['brinco', 'nomeAnimal', 'lote', 'momentoReprodutivo', 'coberturas', 'crias', 'id'].includes(key))
                  .map(([key, value]) => renderDetailItem(formatLabel(key), value))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={48} color="#003AAA" />
              <Text style={styles.errorText}>Não foi possível carregar os detalhes do animal.</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};
const AnimalListItem = ({ item, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.item}
      >
        <View style={styles.itemContent}>
          <Text style={styles.itemText}>{item.brinco}</Text>
          <Text style={styles.itemText}>{item.nomeAnimal}</Text>
          <Text style={styles.itemText}>{item.momentoReprodutivo}</Text>
        </View>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setModalVisible(true)}
          accessibilityLabel={`Ver detalhes de ${item.nomeAnimal}`}
        >
          <Icon name="eye-outline" size={24} color="#003AAA" />
        </TouchableOpacity>
      </TouchableOpacity>

      <AnimalDetailModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        animalId={item.id}
      />
    </>
  );
};

const styles = StyleSheet.create({
   modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#003AAA', // Changed header background to blue
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', // Changed title color to white for better contrast
  },
  modalContent: {
    padding: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#003AAA',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#003AAA',
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003AAA',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003AAA',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 14,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
  },
});

export default AnimalListItem;

