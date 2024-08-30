import { View, Text, Button, StyleSheet } from 'react-native';

const DashboardScreen = () => {
return(
    <View style={styles.container}>
        <Text style={styles.text}>Dashboard Screen</Text>
    </View>
)
}

export  default DashboardScreen;

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