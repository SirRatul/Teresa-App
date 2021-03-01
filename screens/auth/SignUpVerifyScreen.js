import React, {useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity , TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import Logo from '../../assets/teresa.png';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import FloatingLabelVerificationCodeInput from '../../components/FloatingLabelVerificationCodeInput';
import CustomAlert from '../../components/CustomAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import {APP_BACKEND_URL} from "@env"

const SignUpVerifyScreen = (props) => {
    const [verificationCode, setVerificationCode] = useState('')
    const [verificationCodeError, setVerificationCodeError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const verificationCodeValidation = (value) => {
        if(!value){
            setVerificationCodeError('Invalid Verification Code')
        } else {
            setVerificationCodeError(null)
        }
    }
    const submitHandler = async() => {
        if(!verificationCodeError && verificationCode){
            Keyboard.dismiss()
            setIsLoading(true)
            try {
                const response = await axios.post(APP_BACKEND_URL+'users/verify-otp', {
                    _id: props.navigation.getParam('id'),
                    otp: verificationCode
                })
                setIsLoading(false)
                props.navigation.navigate('Login', { 
                    message: response.data.message
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
            {errorMessage &&<CustomAlert message={errorMessage} onClear={modalHandler}/>}
            <View style={styles.screen}>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(1)}}>
                    <Image source={Logo} style={{width: '25%', height: '25%', resizeMode: 'contain' }}/>
                    <Text style={{fontWeight: 'bold', color: Colors.resolutionBlue, fontSize: RFValue(15), marginTop: RFPercentage(6)}}>You will receive a verification code at</Text>
                    <Text style={{fontWeight: 'bold', color: Colors.resolutionBlue, fontSize: RFValue(15)}}>the phone number you entered to create account.</Text>
                    <Text style={{fontWeight: 'bold', color: Colors.resolutionBlue, fontSize: RFValue(15)}}>Please enter the code to verify your account</Text>
                </View>
                <View style={{marginHorizontal: RFPercentage(3), marginTop: RFPercentage(5), backgroundColor: Colors.blackSqueeze, padding: 6}}>
                    <FloatingLabelVerificationCodeInput style={{color: Colors.danube}} onChangeText={text => setVerificationCode(text)} value={verificationCode} label='Enter the 4 Digit Verfication Code' keyboardType='number-pad' inputValidation={verificationCodeValidation}/>
                </View>
                {verificationCodeError &&
                <View style={{alignSelf: 'flex-start', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(1)}}>
                    <Text style={{fontSize: RFValue(12), color: 'red'}}>{verificationCodeError}</Text>
                </View>
                }
                <TouchableOpacity onPress={submitHandler}>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(3), backgroundColor: Colors.funBlue, padding: 6}}>
                        <Text style={{fontSize: RFValue(16), color: 'white'}}>Verify</Text>
                    </View>
                </TouchableOpacity>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(3)}}>
                    <TouchableOpacity style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: RFValue(16), color: Colors.funBlue}}>Don't get the code yet?</Text>
                        <Text style={{fontSize: RFValue(16), color: Colors.funBlue, fontWeight: 'bold'}}> Resend Code</Text>
                    </TouchableOpacity>
                </View>
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

export default SignUpVerifyScreen