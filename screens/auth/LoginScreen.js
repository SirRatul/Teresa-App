import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Logo from '../../assets/teresa.png';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome } from '@expo/vector-icons';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import FloatingLabelPhoneInput from '../../components/FloatingLabelPhoneInput';
import CustomAlert from '../../components/CustomAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import Colors from '../../constants/Colors';
import {APP_BACKEND_URL} from "@env"

const LoginScreen = (props) => {
    const passwordInput = useRef(null)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [phoneNumberError, setPhoneNumberError] = useState(null)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(null)
    const [visible, setVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const icon = !visible ? 'eye-slash' : 'eye';
    const scrollView = useRef(null)
    /*useEffect(() => {
        scrollView.current.scrollToEnd({ animated: true });
    }, [])*/
    const phoneNumberValidation = (value) => {
        if(!value){
            setPhoneNumberError('Invalid phone number')
        } else {
            setPhoneNumberError(null)
        }
    }
    const passwordValidation = (value) => {
        if(!value){
            setPasswordError('Invalid password')
        } else {
            setPasswordError(null)
        }
    }
    const submitHandler = async() => {
        if(!phoneNumberError && !passwordError && phoneNumber && password){
            Keyboard.dismiss()
            setIsLoading(true)
            try {
                const response = await axios.post(APP_BACKEND_URL+'users/login', {
                    phone: '88'+phoneNumber,
                    password
                })
                setIsLoading(false)
                AsyncStorage.setItem('userData', JSON.stringify({
                    token: response.data.message.token,
                    userId: response.data.message.user._id,
                    firstName: response.data.message.user.firstName,
                    lastName: response.data.message.user.lastName,
                    phone: response.data.message.user.phone,
                    address: response.data.message.user.address
                }))
                props.navigation.navigate('Teresa')
            } catch (error) {
                setIsLoading(false)
                setErrorMessage(error.response.data.message)
            }
        }
    }
    const modalHandler = () => {
        props.navigation.setParams({
            message: null
        })
        setErrorMessage(null)
    }
    return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screen} keyboardVerticalOffse={150}> 
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {/* <SafeAreaView style={styles.screen}> */}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} ref={scrollView} /*onContentSizeChange={(contentWidth, contentHeight) => {
                scrollView.current.scrollToEnd({ animated: true });
            }}*/>
                <View style={{flex: 1}}>
                    {errorMessage &&<CustomAlert message={errorMessage} onClear={modalHandler}/>}
                    {props.navigation.getParam('message') &&<CustomAlert message={props.navigation.getParam('message')} onClear={modalHandler}/>}
                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(1)}}>
                        <Image source={Logo} style={{width: '25%', height: '25%', resizeMode: 'contain' }}/>
                        <Text style={{fontWeight: 'bold', color: Colors.resolutionBlue, fontSize: RFValue(18), marginTop: RFPercentage(8)}}>Log in</Text>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(3), backgroundColor: Colors.blackSqueeze}}>
                        <FloatingLabelPhoneInput style={{flex: 1, color: Colors.danube}}  label="Phone Number" value={phoneNumber} onChangeText={text => setPhoneNumber(text)} keyboardType='phone-pad' blurOnSubmit={false} returnKeyType="next" onSubmitEditing={() => passwordInput.current.focus()} inputValidation={phoneNumberValidation}/>
                    </View>
                    {phoneNumberError &&
                    <View style={{alignSelf: 'flex-start', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(1)}}>
                        <Text style={{fontSize: RFValue(12), color: 'red'}}>{phoneNumberError}</Text>
                    </View>
                    }
                    <View style={{flexDirection: 'row', marginTop: RFPercentage(6), marginBottom: RFPercentage(3), marginHorizontal: RFPercentage(3), backgroundColor: Colors.blackSqueeze, padding: 6}}>
                        <FloatingLabelInput myRef={passwordInput} style={{flex: 1, color: Colors.danube}} label="Password" value={password} onChangeText={text => setPassword(text)} secureTextEntry={!visible} blurOnSubmit inputValidation={passwordValidation}/>
                        <FontAwesome name={icon} size={20} color={Colors.regentStBlue} onPress={() => setVisible(!visible)} style={{margin : 5}}/>
                    </View>
                    {passwordError &&
                    <View style={{alignSelf: 'flex-start', marginHorizontal: RFPercentage(3), marginTop: -RFPercentage(2), marginBottom: RFPercentage(2)}}>
                        <Text style={{fontSize: RFValue(12), color: 'red'}}>{passwordError}</Text>
                    </View>
                    }
                    <View style={{alignSelf: 'flex-start', marginHorizontal: RFPercentage(3)}}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('ForgotPass')
                        }}>
                            <Text style={{fontSize: RFValue(16), color: Colors.funBlue}}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={submitHandler}>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(3), backgroundColor: Colors.funBlue, padding: 6}}>
                            <Text style={{fontSize: RFValue(18), color: 'white'}}>Log In</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginTop: RFPercentage(30), marginBottom: RFValue(10)}}>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                        props.navigation.navigate('SignUp')
                    }}>
                        <Text style={{fontSize: RFValue(16), color: Colors.funBlue}}>Don't have any account?</Text>
                        <Text style={{fontSize: RFValue(16), color: Colors.funBlue, fontWeight: 'bold'}}> Create Account</Text>
                    </TouchableOpacity>
                </View>
                {isLoading &&
                    <LoadingSpinner/>
                }
            </ScrollView>
            {/* </SafeAreaView> */}
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default LoginScreen