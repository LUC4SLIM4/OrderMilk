import React from "react";
import { VictoryBar, VictoryChart, VictoryLegend } from "victory-native";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import mock from "../../db/mock.json";

const Chart = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  // Agrupando os animais por lote e contando
  const animalCounts = mock.animals.reduce((acc, animal) => {
    acc[animal.lote] = (acc[animal.lote] || 0) + 1;
    return acc;
  }, {});

  // Se não houver dados
  if (Object.keys(animalCounts).length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Nenhum dado disponível</Text>
      </View>
    );
  }

  // Formatando os dados para o gráfico de barras
  const chartData = Object.entries(animalCounts).map(([lote, count]) => ({
    x: lote,
    y: count,
  }));

  // Definindo a escala de cores
  const colorScale = ["#2C8BB9", "#2E5F99", "#30356D"];

  // Definindo a largura da barra com base no número de lotes
  const barWidth = screenWidth / (chartData.length * 2); // Ajusta a largura proporcionalmente ao número de lotes

  // Definindo espaçamento dinâmico baseado no número de lotes
  const domainPadding = chartData.length > 6 ? { x: 50 } : { x: 80 };

  // Configurando a legenda
  const legendData = chartData.map((data, index) => ({
    name: `${data.x} (${data.y})`,
    symbol: { fill: colorScale[index % colorScale.length] },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <VictoryChart domainPadding={domainPadding} animate={{ duration: 500 }}>
          <VictoryBar
            data={chartData}
            style={{
              data: {
                fill: ({ index }) => colorScale[index % colorScale.length],
                width: barWidth, // Definindo a largura da barra dinamicamente
              },
            }}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onPress: (event, data) => {
                    const clickedLote = data.datum.x;
                    navigation.navigate("RebanhoScreen", { filtroLote: clickedLote });
                  },
                },
              },
            ]}
          />
        </VictoryChart>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  chartContainer: {
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "red",
  },
});

export default Chart;
