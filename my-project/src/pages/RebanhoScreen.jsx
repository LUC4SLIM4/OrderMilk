import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import FilterBar from '../components/RebanhoScreen/FilterBar';
import AnimalListItem from '../components/RebanhoScreen/AnimalListItem';
import ListHeader from '../components/RebanhoScreen/ListHeader';
import { fetchAnimals } from '../api/fetchAnimals';

export default function RebanhoScreen({ route, navigation }) {
  const { filtroLote: filtroLoteParam } = route.params || {}; 
  const [animais, setAnimals] = useState([]);
  const [filtroLote, setFiltroLote] = useState(filtroLoteParam || ''); 
  const [pesquisa, setPesquisa] = useState('');
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchAnimals(setAnimals, setLotes);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (filtroLoteParam) {
      setFiltroLote(filtroLoteParam); 
    }
  }, [filtroLoteParam]);

  const animaisFiltrados = animais.filter(animal =>
    (filtroLote === '' || filtroLote === 'Todos' || animal.lote === filtroLote) &&
    (animal.brinco.toLowerCase().includes(pesquisa.toLowerCase()) ||
      animal.nome.toLowerCase().includes(pesquisa.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
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
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});
