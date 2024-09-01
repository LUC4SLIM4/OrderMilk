import { View, Text, Button, StyleSheet } from 'react-native';

const RebanhoScreen = () => {
return(
    <View style={styles.container}>
        <Text style={styles.text}>Rebanho Screen</Text>
    </View>
)
}

export  default RebanhoScreen;

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
