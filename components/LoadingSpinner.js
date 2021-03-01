import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';

const LoadingSpinner = () => {
    return <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', opacity: 0.5}}>
        <ActivityIndicator size='large' color={Colors.funBlue}/>
    </View>
}
 
export default LoadingSpinner