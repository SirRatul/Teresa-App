import React, { useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

const AuthLoadingScreen = (props) => {
    const [isReady, setIsReady] = useState(false)
    const getUserData = async() => {
        const userData = await AsyncStorage.getItem('userData')
        if(userData){
            props.navigation.navigate('Teresa')
        } else {
            props.navigation.navigate('Auth')
        }
    }
    
    if (!isReady) {
        return <AppLoading
          startAsync={getUserData}
          onFinish={() => {setIsReady(true)}}
          onError={(error) => {console.log(error)}}
        />
    }
}

export default AuthLoadingScreen
