import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, SafeAreaView } from 'react-native';
import FilterBar from '../components/RebanhoScreen/FilterBar';
import AnimalListItem from '../components/RebanhoScreen/AnimalListItem';
import ListHeader from '../components/RebanhoScreen/ListHeader';

export default function RebanhoScreen({ navigation }) {
  const [animais, setAnimais] = useState([]);
  const [filtroLote, setFiltroLote] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [lotes, setLotes] = useState([]);

  useEffect(() => {
    const fetchAnimais = async () => {
      // Simulação de dados
      const dadosSimulados = [
        { id: '1', brinco: '001', nome: 'Mimosa', lote: 'A' },
        { id: '2', brinco: '002', nome: 'Estrela', lote: 'B' },
        { id: '3', brinco: '003', nome: 'Malhada', lote: 'A' },
        { id: '4', brinco: '004', nome: 'Chifruda', lote: 'C' },
        { id: '5', brinco: '005', nome: 'Mimosa', lote: 'A' },
        { id: '6', brinco: '006', nome: 'Estrela', lote: 'B' },
        { id: '7', brinco: '007', nome: 'Malhada', lote: 'A' },
        { id: '8', brinco: '008', nome: 'Chifruda', lote: 'C' },
        { id: '9', brinco: '009', nome: 'Mimosa', lote: 'A' },
        { id: '10', brinco: '010', nome: 'Malhada', lote: 'A' },
        { id: '11', brinco: '011', nome: 'Chifruda', lote: 'C' },
        { id: '12', brinco: '012', nome: 'Mimosa', lote: 'A' },
      ];
      setAnimais(dadosSimulados);
      
      const lotesUnicos = [...new Set(dadosSimulados.map(a => a.lote))];
      setLotes(['Todos', ...lotesUnicos]);
    };

    fetchAnimais();
  }, []);

  const animaisFiltrados = animais.filter(animal => 
    (filtroLote === '' || filtroLote === 'Todos' || animal.lote === filtroLote) &&
    (animal.brinco.toLowerCase().includes(pesquisa.toLowerCase()) ||
     animal.nome.toLowerCase().includes(pesquisa.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}> 
      <FilterBar
        pesquisa={pesquisa}
        setPesquisa={setPesquisa}
        filtroLote={filtroLote}
        setFiltroLote={setFiltroLote}
        lotes={lotes}
      />
      <FlatList
        data={animaisFiltrados}
        renderItem={({ item }) => (
          <AnimalListItem item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});
