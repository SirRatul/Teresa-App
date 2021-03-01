import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const NotificationScreen = (props) => {
    return <View style={styles.screen}>
        <Text>Notification Screen</Text>
    </View>
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default NotificationScreen