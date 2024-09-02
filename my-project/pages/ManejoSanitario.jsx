import { View, Text, Button, StyleSheet } from 'react-native';

const ManejoSanitario = () => {
return(
    <View style={styles.container}>
        <Text style={styles.text}>Manejo Sanitario</Text>
    </View>
)
}

export  default ManejoSanitario;

const styles =  StyleSheet.create({
    container: {
        flex: 0.88,
        justifyContent: 'center',
        alignItems: 'center',
        },
        text: {
            fontSize: 24,
            fontWeight: 'bold',
            },        
});
