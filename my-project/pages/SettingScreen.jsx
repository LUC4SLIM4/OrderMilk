import { View, Text, Button, StyleSheet } from 'react-native';

const SettingScreen = () => {
return(
    <View style={styles.container}>
        <Text style={styles.text}>Settings Screen</Text>
    </View>
)
}

export  default SettingScreen;

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
