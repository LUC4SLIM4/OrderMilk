import mock from '../db/mock.json';

const fetchAnimals = (setAnimais, setLotes) => {
  try {
    const data = mock.animals; // Acessa os dados do arquivo JSON importado

    setAnimais(data); // Atualiza o estado dos animais

    const lotesUnicos = [...new Set(data.map((a) => a.lote))];
    setLotes(['Todos', ...lotesUnicos]); // Atualiza o estado dos lotes
  } catch (error) {
    console.error('Erro ao buscar os animais:', error);
  }
};

export { fetchAnimals };
