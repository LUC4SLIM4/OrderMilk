import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { database } from '../config/firebaseConfig';
import { ref, onValue } from 'firebase/database';

const { width } = Dimensions.get('window');

export default function Component() {
  const [productionData, setProductionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [animalData, setAnimalData] = useState(null);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordenhasRef = ref(database, 'ordenhas');
        onValue(ordenhasRef, (snapshot) => {
          const data = snapshot.val();
          const processedData = {};
          Object.entries(data || {}).forEach(([key, value]) => {
            const [date, session] = key.split('_');
            const [year, month, day] = [date.substring(0, 4), date.substring(4, 6), date.substring(6, 8)];
            const formattedDate = `${year}-${month}-${day}`;
            if (!processedData[formattedDate]) {
              processedData[formattedDate] = { total: 0, animals: {} };
            }
            processedData[formattedDate].total += value.totalFinal || 0;
            if (value.nomeAnimal && value.brinco) {
              if (!processedData[formattedDate].animals[value.brinco]) {
                processedData[formattedDate].animals[value.brinco] = {
                  name: value.nomeAnimal,
                  total: 0
                };
              }
              processedData[formattedDate].animals[value.brinco].total += value.totalFinal || 0;
            }
          });
          setProductionData(processedData);
          setLoading(false);
        }, (error) => {
          console.error('Erro ao buscar dados:', error);
          setError('Falha ao carregar dados.');
          setLoading(false);
        });
      } catch (err) {
        console.error('Erro inesperado:', err);
        setError('Ocorreu um erro inesperado.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getChartData = () => {
    return Object.entries(productionData)
      .filter(([date]) => {
        const currentDate = new Date(date);
        return currentDate >= startDate && currentDate <= endDate;
      })
      .map(([date, data]) => ({ date, value: data.total }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const chartData = getChartData();

  const totalProduction = chartData.reduce((sum, item) => sum + item.value, 0);
  const averageProduction = totalProduction / chartData.length || 0;

  const searchAnimal = () => {
    if (!searchTerm.trim()) return;
    
    const animalProduction = {};
    Object.entries(productionData).forEach(([date, dayData]) => {
      Object.entries(dayData.animals).forEach(([brinco, animalInfo]) => {
        if (animalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            brinco.includes(searchTerm)) {
          if (!animalProduction[date]) {
            animalProduction[date] = 0;
          }
          animalProduction[date] += animalInfo.total;
        }
      });
    });

    const chartDataAnimal = Object.entries(animalProduction).map(([date, total]) => ({
      date,
      value: total
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    setAnimalData(chartDataAnimal);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard de Produção de Leite</Text>
        </View>

        <View style={styles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
          </TouchableOpacity>
          <Text style={styles.dateSeperator}>-</Text>
          <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}

        <View style={styles.chartContainer}>
          {chartData.length > 0 ? (
            <View>
              <ScrollView
                horizontal
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
              >
                <BarChart
                  data={{
                    labels: chartData.map(item => 
                      new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                    ),
                    datasets: [{
                      data: chartData.map(item => item.value)
                    }]
                  }}
                  width={Math.max(width - 70, chartData.length * 50)}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix="L"
                  withInnerLines={true}
                  showValuesOnTopOfBars={true}
                  fromZero={true}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 58, 170, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    barPercentage: 0.7,
                    propsForBackgroundLines: {
                      strokeDasharray: "6 6",
                      strokeWidth: 1,
                      stroke: "#e3e3e3",
                    },
                    propsForLabels: {
                      fontSize: 10,
                      rotation: 0,
                    },
                    formatTopBarValue: (value) => `${Math.round(value)}`
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    paddingRight: 0
                  }}
                />
              </ScrollView>
              <View style={styles.scrollIndicator} />
            </View>
          ) : (
            <Text style={styles.noDataText}>Nenhum dado disponível para o período selecionado</Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Produção Total:</Text>
            <Text style={styles.statValue}>{totalProduction.toFixed(2)} L</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Média Diária:</Text>
            <Text style={styles.statValue}>{averageProduction.toFixed(2)} L</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou brinco do animal"
            placeholderTextColor="#666"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={searchAnimal}
          >
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {animalData && (
          <View style={styles.animalDataContainer}>
            <Text style={styles.animalDataTitle}>Produção do Animal: {searchTerm}</Text>
            <View style={styles.chartContainer}>
              <ScrollView
                horizontal
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
              >
                <BarChart
                  data={{
                    labels: animalData.map(item => 
                      new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                    ),
                    datasets: [{
                      data: animalData.map(item => item.value)
                    }]
                  }}
                  width={Math.max(width - 70, animalData.length * 50)}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix="(L)"
                  withInnerLines={true}
                  showValuesOnTopOfBars={true}
                  fromZero={true}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 58, 170, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    barPercentage: 0.7,
                    propsForBackgroundLines: {
                      strokeDasharray: "6 6",
                      strokeWidth: 1,
                      stroke: "#e3e3e3",
                    },
                    propsForLabels: {
                      fontSize: 10,
                      rotation: 0,
                    },
                    formatTopBarValue: (value) => `${Math.round(value)}`
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    paddingRight: 0
                  }}
                />
              </ScrollView>
              <View style={styles.scrollIndicator} />
            </View>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                setAnimalData(null);
                setSearchTerm('');
              }}
            >
              <Text style={styles.backButtonText}>Voltar para Visão Geral</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
  dateSeperator: {
    marginHorizontal: 8,
    fontSize: 18,
    color: '#333',
  },
  chartContainer: {
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollIndicator: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex:  1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchButton: {
    backgroundColor: '#4287f5',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  animalDataContainer: {
    marginTop: 20,
  },
  animalDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#4287f5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText:  {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});