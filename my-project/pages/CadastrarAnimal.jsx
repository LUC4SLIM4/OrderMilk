import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CadastrarAnimal = () => {
  const [brinco, setBrinco] = useState('');
  const [nomeAnimal, setNomeAnimal] = useState('');
  const [idade, setIdade] = useState('');
  const [lote, setLote] = useState('');
  const [pai, setPai] = useState('');
  const [mae, setMae] = useState('');

  const handleSubmit = () => {
    // Aqui você pode adicionar a lógica para cadastrar o animal
    console.log('Cadastrar Animal:', {
      brinco,
      nomeAnimal,
      idade,
      lote,
      pai,
      mae,
    });

    // Redefina os estados dos campos para uma string vazia
    setBrinco('');
    setNomeAnimal('');
    setIdade('');
    setLote('');
    setPai('');
    setMae('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text>Número do Brinco:</Text>
        <TextInput
          style={styles.input}
          value={brinco}
          onChangeText={(text) => setBrinco(text)}
          keyboardType="numeric"
        />
        <Text>Nome do Animal:</Text>
        <TextInput
          style={styles.input}
          value={nomeAnimal}
          onChangeText={(text) => setNomeAnimal(text)}
        />
        <Text>Idade:</Text>
        <TextInput
          style={styles.input}
          value={idade}
          onChangeText={(text) => setIdade(text)}
          keyboardType="numeric"
        />
        <Text>Lote:</Text>
        <TextInput
          style={styles.input}
          value={lote}
          onChangeText={(text) => setLote(text)}
          keyboardType="numeric"
        />
        <Text>Pai:</Text>
        <TextInput
          style={styles.input}
          value={pai}
          onChangeText={(text) => setPai(text)}
        />
        <Text>Mãe:</Text>
        <TextInput
          style={styles.input}
          value={mae}
          onChangeText={(text) => setMae(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.88,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2', // adicionado cor de fundo
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold', // adicionado negrito
  },
  form: {
    width: '80%',
    padding: 20, // adicionado padding
    backgroundColor: '#fff', // adicionado cor de fundo
    borderRadius: 10, // adicionado borda arredondada
    shadowColor: '#000', // adicionado sombra
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc', // alterado cor da borda
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5, // adicionado borda arredondada
  },
  button: {
    backgroundColor: '#003AAA',
    padding: 10,
    borderRadius: 5,
    width: '100%', // adicionado largura
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold', // adicionado negrito
  },
});

export default CadastrarAnimal;