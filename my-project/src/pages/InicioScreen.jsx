import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Feather';

const InicioScreen = () => {
  const navigation = useNavigation();

  // Estado para os dados do gráfico
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simula a obtenção de dados do Firebase
  useEffect(() => {
    // Aqui você pode simular uma chamada a uma API ou ao Firebase
    const fetchData = async () => {
      try {
        // Simulando dados de produção semanal
        const simulatedData = {
          labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
          datasets: [
            {
              data: [30, 45, 28, 80, 99, 43, 50], // Valores fictícios
              color: (opacity = 1) => `rgba(0, 58, 170, ${opacity})`, // Cor das barras
              strokeWidth: 2, // Largura da linha
            },
          ],
        };
        setChartData(simulatedData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const buttons = [
    { title: 'Cadastrar Animal', icon: 'plus', onPress: () => navigation.navigate('CadastrarAnimal') },
    { title: 'Rebanho', icon: 'users', onPress: () => navigation.navigate('RebanhoScreen') },
    { title: 'Manejo Sanitário', icon: 'heart', onPress: () => navigation.navigate('ManejoSanitario') },
    { title: 'Producao', icon: 'settings', onPress: () => navigation.navigate('Producao') },
  ];

  const renderChart = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#003AAA" />;
    }

    if (error) {
      return <Text style={styles.errorText}>Erro ao carregar os dados: {error.message}</Text>;
    }

    if (!chartData) {
      return <Text style={styles.errorText}>Nenhum dado disponível</Text>;
    }

    return (
      <BarChart
        data={chartData}
        width={Dimensions.get('window').width - 70}
        height={250}
        yAxisLabel=""
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
          propsForLabels: {
            fontSize: 12,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        showValuesOnTopOfBars={true}
        fromZero={true}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.buttonGrid}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={button.onPress}
              activeOpacity={0.8}
            >
              <Icon name={button.icon} size={32} color="white" />
              <Text style={styles.buttonText}>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="droplet" size={24} color="#003AAA" />
            <Text style={styles.sectionTitle}>Registrar Tirada</Text>
          </View>
          <Text style={styles.sectionDescription}>Registre a produção de leite do seu rebanho.</Text>
          <TouchableOpacity
            style={styles.sectionButton}
            onPress={() => navigation.navigate('RegistrarTiradaScreen')}
          >
            <Text style={styles.sectionButtonText}>Iniciar Registro</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="bar-chart-2" size={24} color="#003AAA" />
            <Text style={styles.sectionTitle}>Produção Semanal</Text>
          </View>
          {renderChart()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: 50
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#003AAA',
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#003AAA',
    padding: 16,
    borderRadius: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  sectionDescription: {
    color: '#666',
    marginBottom: 16,
  },
  sectionButton: {
    backgroundColor: '#003AAA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sectionButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default InicioScreen;
