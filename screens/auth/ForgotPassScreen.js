import React, {useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import Logo from '../../assets/teresa.png';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import CustomAlert from '../../components/CustomAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import {APP_BACKEND_URL} from "@env"

const ForgotPassScreen = (props) => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [phoneNumberError, setPhoneNumberError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const phoneNumberValidation = (value) => {
        if(!value){
            setPhoneNumberError('Invalid Phone Number')
        } else {
            setPhoneNumberError(null)
        }
    }
    const submitHandler = async() => {
        if(!phoneNumberError && phoneNumber){
            Keyboard.dismiss()
            setIsLoading(true)
            try {
                const response = await axios.post(APP_BACKEND_URL+'users/pass-recovery-code', {
                    phone: '88'+phoneNumber
                })
                setIsLoading(false)
                props.navigation.navigate('ForgotPassVerify', { 
                    phoneNumber
                })
            } catch (error) {
                setIsLoading(false)
                setErrorMessage(error.response.data.message)
            }
        }
    }
    const modalHandler = () => {
        setErrorMessage(null)
    }
    return <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.screen}>
            <View style={styles.screen}>
                {errorMessage &&<CustomAlert message={errorMessage} onClear={modalHandler}/>}
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(1)}}>
                    <Image source={Logo} style={{width: '25%', height: '25%', resizeMode: 'contain' }}/>
                    <Text style={{fontWeight: 'bold', color: Colors.resolutionBlue, fontSize: RFValue(18), marginTop: RFPercentage(8)}}>Reset Password</Text>
                    <Text style={{color: Colors.resolutionBlue, fontSize: RFValue(15), marginTop: RFPercentage(8)}}>Enter your phone number you used to</Text>
                    <Text style={{color: Colors.resolutionBlue, fontSize: RFValue(15)}}>create your Teresa account.</Text>
                </View>
                <View style={{marginHorizontal: RFPercentage(3), marginTop: RFPercentage(5), backgroundColor: Colors.blackSqueeze, padding: 6}}>
                    <FloatingLabelInput style={{color: Colors.danube}} onChangeText={text => setPhoneNumber(text)} value={phoneNumber} label='Phone Number' keyboardType='phone-pad' blurOnSubmit inputValidation={phoneNumberValidation}/>
                </View>
                {phoneNumberError &&
                <View style={{alignSelf: 'flex-start', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(1)}}>
                    <Text style={{fontSize: RFValue(12), color: 'red'}}>{phoneNumberError}</Text>
                </View>
                }
                <TouchableOpacity onPress={submitHandler}>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2), backgroundColor: Colors.funBlue, padding: 5}}>
                        <Text style={{fontSize: RFValue(16), color: 'white'}}>Next</Text>
                    </View>
                </TouchableOpacity>
                <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: RFValue(40), right: RFValue(15), alignSelf: 'flex-end'}} onPress={() => {
                    props.navigation.navigate('Login')
                }}/>
            </View>
            {isLoading &&
                <LoadingSpinner/>
            }
        </SafeAreaView>
    </TouchableWithoutFeedback>
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default ForgotPassScreen