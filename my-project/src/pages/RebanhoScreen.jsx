import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, SafeAreaView, ActivityIndicator, View, Text } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebaseConfig';
import FilterBar from '../components/RebanhoScreen/FilterBar';
import AnimalListItem from '../components/RebanhoScreen/AnimalListItem';
import ListHeader from '../components/RebanhoScreen/ListHeader';

export default function RebanhoScreen({ route, navigation }) {
  const { filtroLote: filtroLoteParam } = route.params || {};
  const [animais, setAnimais] = useState([]);
  const [filtroLote, setFiltroLote] = useState(filtroLoteParam || '');
  const [pesquisa, setPesquisa] = useState('');
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const animaisRef = ref(database, 'animais');
    const unsubscribe = onValue(animaisRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const animaisList = Object.entries(data).map(([id, animal]) => ({
          id,
          brinco: animal.brinco || '',
          nomeAnimal: animal.nomeAnimal || '',
          momentoReprodutivo: animal.momentoReprodutivo || '',
          lote: animal.lote || '',
        }));
        setAnimais(animaisList);
        const uniqueLotes = [...new Set(animaisList.map(animal => animal.lote).filter(Boolean))];
        setLotes(['Todos', ...uniqueLotes]);
      } else {
        setAnimais([]);
        setLotes(['Todos']);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching animals:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (filtroLoteParam) {
      setFiltroLote(filtroLoteParam);
    }
  }, [filtroLoteParam]);

  const animaisFiltrados = animais.filter(animal =>
    (filtroLote === '' || filtroLote === 'Todos' || animal.lote === filtroLote) &&
    (animal.brinco.toLowerCase().includes(pesquisa.toLowerCase()) ||
      animal.nomeAnimal.toLowerCase().includes(pesquisa.toLowerCase()))
  );

  const renderEmptyList = () => (
    <View style={styles.emptyList}>
      <Text style={styles.emptyListText}>Nenhum animal encontrado</Text>
    </View>
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
              <AnimalListItem key={animais.id} item={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={renderEmptyList}
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
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyListText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});