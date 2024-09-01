import { View, Text, Button, StyleSheet } from 'react-native';

const CadastrarAnimal = () => {
return(
    <View style={styles.container}>
        <Text style={styles.text}>Cadastrar Animal</Text>
    </View>
)
}

export  default CadastrarAnimal;

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        },
        text: {
            fontSize: 24,
            fontWeight: 'bold',
            },        
});