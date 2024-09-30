import { View, Text, Button, StyleSheet } from 'react-native';

const GestaoNutritiva = () => {
return(
    <View style={styles.container}>
        <Text style={styles.text}>Gestao Nutritiva</Text>
    </View>
)
}

export  default GestaoNutritiva;

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
