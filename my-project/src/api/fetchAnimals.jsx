import { ref, get } from 'firebase/database';
import { database } from '../config/firebaseConfig'; // Certifique-se de que o caminho esteja correto

const fetchAnimals = async (setAnimais, setLotes) => {
  try {
    const animaisRef = ref(database, 'animais');
    const snapshot = await get(animaisRef); // Faz a leitura dos dados do Firebase

    if (snapshot.exists()) {
      const data = snapshot.val();

      // Filtra apenas os campos brinco, nome e lote
      const animalsArray = Object.values(data).map(animal => ({
        brinco: animal.brinco || 'N/A',
        nome: animal.nomeAnimal || 'N/A',
        lote: animal.momentoReprodutivo || 'N/A',
      }));

      setAnimais(animalsArray); // Atualiza o estado dos animais

      const lotesUnicos = [...new Set(animalsArray.map((a) => a.lote))];
      setLotes(['Todos', ...lotesUnicos]); // Atualiza o estado dos lotes
    } else {
      setAnimais([]); // Se não houver animais no banco, define um array vazio
    }
  } catch (error) {
    console.error('Erro ao buscar os animais:', error);
  }
};

export { fetchAnimals };
