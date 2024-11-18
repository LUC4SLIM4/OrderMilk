import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { database } from '../config/firebaseConfig';
import { ref, query, orderByChild, limitToLast, get } from 'firebase/database';

export default function MilkProductionPage() {
  const [filter, setFilter] = useState('30days');
  const [productionData, setProductionData] = useState([]);
  const [averagePerAnimal, setAveragePerAnimal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProduction, setTotalProduction] = useState(0);

  useEffect(() => {
    fetchProductionData();
  }, [filter]);

  const fetchProductionData = async () => {
    setIsLoading(true);
    const ordenhasRef = ref(database, 'ordenhas');
    let ordenhasQuery;

    if (filter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      ordenhasQuery = query(
        ordenhasRef,
        orderByChild('data'),
        limitToLast(90)
      );
    } else if (filter === 'lastProduction') {
      ordenhasQuery = query(
        ordenhasRef,
        orderByChild('data'),
        limitToLast(3)
      );
    } else {
      ordenhasQuery = query(
        ordenhasRef,
        orderByChild('data'),
        limitToLast(90)
      );
    }

    try {
      const snapshot = await get(ordenhasQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = processProductionData(data);
        setProductionData(formattedData);
        calculateAveragePerAnimal(formattedData);
        calculateTotalProduction(formattedData);
      } else {
        console.log('No data available');
        setProductionData([]);
        setAveragePerAnimal(0);
        setTotalProduction(0);
      }
    } catch (error) {
      console.error('Error fetching production data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados de produção. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const processProductionData = (data) => {
    if (!data || typeof data !== 'object') {
      console.error('Invalid data format:', data);
      return [];
    }

    const dailyData = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate());

    Object.entries(data).forEach(([key, value]) => {
      if (!value || typeof value !== 'object') {
        console.warn('Invalid entry:', key, value);
        return;
      }

      const [date, session, brinco] = key.split('_');
      if (!date || !session || !brinco) {
        console.warn('Invalid key format:', key);
        return;
      }

      const entryDate = new Date(date);
      if (entryDate < thirtyDaysAgo) {
        return;
      }

      if (!dailyData[date]) {
        dailyData[date] = {
          tiradas: [0, 0, 0],
          totalFinal: 0,
          animalsCount: new Set(),
        };
      }

      const sessionIndex = parseInt(session) - 1;
      if (sessionIndex >= 0 && sessionIndex < 3) {
        dailyData[date].tiradas[sessionIndex] += value.totalFinal || 0;
      }

      dailyData[date].totalFinal += value.totalFinal || 0;
      dailyData[date].animalsCount.add(brinco);
    });

    return Object.entries(dailyData).map(([date, info]) => ({
      id: date,
      data: date,
      tiradas: info.tiradas,
      totalFinal: info.totalFinal,
      animalsCount: info.animalsCount.size
    }));
  };

  const calculateAveragePerAnimal = (data) => {
    if (data.length === 0) {
      setAveragePerAnimal(0);
      return;
    }

    const totalProduction = data.reduce((sum, item) => sum + (item.totalFinal || 0), 0);
    const totalAnimals = data.reduce((sum, item) => sum + (item.animalsCount || 0), 0);
    const average = totalAnimals > 0 ? totalProduction / totalAnimals : 0;
    setAveragePerAnimal(average);
  };

  const calculateTotalProduction = (data) => {
    const total = data.reduce((sum, item) => sum + (item.totalFinal || 0), 0);
    setTotalProduction(total);
  };

  const renderProductionItem = ({ item }) => (
    <View style={styles.productionItem}>
      <Text style={styles.productionDate}>{item.data}</Text>
      <View style={styles.tiradasContainer}>
        <Text style={styles.tiradaText}>1ª: {item.tiradas[0].toFixed(2)} L</Text>
        <Text style={styles.tiradaText}>2ª: {item.tiradas[1].toFixed(2)} L</Text>
        <Text style={styles.tiradaText}>3ª: {item.tiradas[2].toFixed(2)} L</Text>
      </View>
      <Text style={styles.productionTotal}>Total: {item.totalFinal.toFixed(2)} L</Text>
      <Text style={styles.productionAnimals}>Animais: {item.animalsCount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produção de Leite</Text>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === '30days' && styles.filterButtonActive]}
          onPress={() => setFilter('30days')}
        >
          <Text style={[styles.filterButtonText, filter === '30days' && styles.filterButtonTextActive]}>
            Últimos 30 dias
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'lastProduction' && styles.filterButtonActive]}
          onPress={() => setFilter('lastProduction')}
        >
          <Text style={[styles.filterButtonText, filter === 'lastProduction' && styles.filterButtonTextActive]}>
            Última Produção
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.averageContainer}>
        <Text style={styles.averageText}>Média por Animal: {averagePerAnimal.toFixed(2)} L</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#003AAA" />
      ) : (
        <>
          <FlatList
            data={productionData}
            renderItem={renderProductionItem}
            keyExtractor={item => item.id}
            style={styles.productionList}
          />
          <Text style={styles.totalText}>Total de Produção: {totalProduction.toFixed(2)} L</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003AAA',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#003AAA',
  },
  filterButtonActive: {
    backgroundColor: '#003AAA',
  },
  filterButtonText: {
    color: '#003AAA',
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  averageContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  averageText: {
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#003AAA',
  },
  productionList: {
    flex: 1,
  },
  productionItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  productionDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003AAA',
    marginBottom: 5,
  },
  tiradasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  tiradaText: {
    fontSize: 14,
    color: '#333',
  },
  productionTotal: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 5,
  },
  productionAnimals: {
    fontSize: 14,
    color: '#666',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003AAA',
    textAlign: 'center',
    marginTop: 20,
  },
});