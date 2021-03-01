import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import Logo from '../../assets/teresa.png';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import FloatingLabelFirstNameInput from '../../components/FloatingLabelFirstNameInput';
import FloatingLabelLastNameInput from '../../components/FloatingLabelLastNameInput';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import FloatingLabelPhoneInput from '../../components/FloatingLabelPhoneInput';
import CustomAlert from '../../components/CustomAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import {APP_BACKEND_URL} from "@env"

const SignUpScreen = (props) => {
    const lastNameInput = useRef(null)
    const phoneNumberInput = useRef(null)
    const passwordInput = useRef(null)
    const scrollView = useRef(null)
    const confirmPasswordInput = useRef(null)
    const [firstName, setFirstName] = useState('')
    const [firstNameError, setFirstNameError] = useState(null)
    const [lastName, setLastName] = useState('')
    const [lastNameError, setLastNameError] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [phoneNumberError, setPhoneNumberError] = useState(null)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState(null)
    const [visiblePassword, setVisiblePassword] = useState(false)
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false)
    const passwordIcon = !visiblePassword ? 'eye-slash' : 'eye';
    const confirmPasswordIcon = !visibleConfirmPassword ? 'eye-slash' : 'eye';
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    /*useEffect(() => {
        scrollView.current.scrollToEnd({ animated: true });
    }, [])*/
    const firstNameValidation = (value) => {
        if(!value){
            setFirstNameError('Invalid First Name')
        } else {
            setFirstNameError(null)
        }
    }
    const lastNameValidation = (value) => {
        if(!value){
            setLastNameError('Invalid Last Name')
        } else {
            setLastNameError(null)
        }
    }
    const phoneNumberValidation = (value) => {
        if(!value){
            setPhoneNumberError('Invalid Phone Number')
        } else {
            setPhoneNumberError(null)
        }
    }
    const passwordValidation = (value) => {
        if(!value){
            setPasswordError('Invalid Password')
        } else {
            setPasswordError(null)
        }
    }
    const confirmPasswordValidation = (value) => {
        if(!value){
            setConfirmPasswordError('Invalid Confirm Password')
        } else {
            setConfirmPasswordError(null)
        }
    }
    const submitHandler = async() => {
        if(!firstNameError && !lastNameError && !phoneNumberError && !passwordError && !confirmPasswordError && firstName && lastName && phoneNumber && password && confirmPassword){
            Keyboard.dismiss()
            if(password != confirmPassword){
                setErrorMessage('Passwords are not same')
            } else {
                setIsLoading(true)
                try {
                    const response = await axios.post(APP_BACKEND_URL+'users', {
                        firstName,
                        lastName,
                        phone: '88'+phoneNumber,
                        password
                    })
                    setIsLoading(false)
                    props.navigation.navigate('SignUpVerify', { 
                        id: response.data.message._id
                    })
                } catch (error) {
                    setIsLoading(false)
                    setErrorMessage(error.response.data.message)
                }
            }
        }
    }
    const modalHandler = () => {
        setErrorMessage(null)
    }
    return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screen}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} ref={scrollView} /*onContentSizeChange={(contentWidth, contentHeight) => {
                scrollView.current.scrollToEnd({ animated: true });
            }}*/>
                <View style={styles.screen}>
                    {errorMessage &&<CustomAlert message={errorMessage} onClear={modalHandler}/>}
                    <View style={{flex: 1, justifyContent: 'flex-start'}}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(5)}}>
                            <Image source={Logo} style={{width: '28%', height: '28%', resizeMode: 'contain' }}/>
                            <Text style={{fontWeight: 'bold', color: Colors.resolutionBlue, fontSize: RFValue(18), marginTop: RFPercentage(8)}}>Create New Account</Text>
                        </View>
                        <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(5)}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', width: '49%', padding: 6, backgroundColor: Colors.blackSqueeze}}>
                                <FloatingLabelFirstNameInput style={{width: '100%', color: Colors.danube}} label="First Name" value={firstName} onChangeText={text => setFirstName(text)} blurOnSubmit={false} returnKeyType="next" onSubmitEditing={() => lastNameInput.current.focus()} inputValidation={firstNameValidation}/>
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center', width: '49%', padding: 6, backgroundColor: Colors.blackSqueeze}}>
                                <FloatingLabelLastNameInput myRef={lastNameInput} style={{width: '100%', color: Colors.danube}} label="Last Name" value={lastName} onChangeText={text => setLastName(text)} blurOnSubmit={false} returnKeyType="next" onSubmitEditing={() => phoneNumberInput.current.focus()} inputValidation={lastNameValidation}/>
                            </View>
                        </View>
                        {firstNameError || lastNameError ?
                        <View style={{width: '100%', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(1), flexDirection: 'row'}}>
                            <View style={{width: '50%'}}>
                                {
                                    firstNameError &&
                                    <Text style={{fontSize: RFValue(12), color: 'red'}}>{firstNameError}</Text>
                                }
                            </View>
                            <View style={{width: '50%'}}>
                                {
                                    lastNameError &&
                                    <Text style={{fontSize: RFValue(12), color: 'red'}}>{lastNameError}</Text>
                                }
                            </View>
                        </View>
                        :
                        null
                        }
                        <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(5), backgroundColor: Colors.blackSqueeze}}>
                            <FloatingLabelPhoneInput myRef={phoneNumberInput} style={{flex: 1, color: Colors.danube}}  label="Phone Number" value={phoneNumber} onChangeText={text => setPhoneNumber(text)} keyboardType='phone-pad' blurOnSubmit={false} returnKeyType="next" onSubmitEditing={() => passwordInput.current.focus()} inputValidation={phoneNumberValidation}/>
                        </View>
                        {phoneNumberError &&
                        <View style={{alignSelf: 'flex-start', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(1)}}>
                            <Text style={{fontSize: RFValue(12), color: 'red'}}>{phoneNumberError}</Text>
                        </View>
                        }
                        <View style={{flexDirection: 'row', marginTop: RFPercentage(5), marginHorizontal: RFPercentage(3), backgroundColor: Colors.blackSqueeze, padding: 5}}>
                            <FloatingLabelInput myRef={passwordInput} style={{flex: 1, color: Colors.danube}}  label="Password" value={password} onChangeText={text => setPassword(text)} secureTextEntry={!visiblePassword} blurOnSubmit={false} returnKeyType="next" onSubmitEditing={() => confirmPasswordInput.current.focus()} inputValidation={passwordValidation}/>
                            <FontAwesome name={passwordIcon} size={20} color={Colors.regentStBlue} onPress={() => setVisiblePassword(!visiblePassword)} style={{margin : 5}}/>
                        </View>
                        {passwordError &&
                        <View style={{alignSelf: 'flex-start', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(1)}}>
                            <Text style={{fontSize: RFValue(12), color: 'red'}}>{passwordError}</Text>
                        </View>
                        }
                        <View style={{flexDirection: 'row', marginTop: RFPercentage(5), marginHorizontal: RFPercentage(3), backgroundColor: Colors.blackSqueeze, padding: 5}}>
                            <FloatingLabelInput myRef={confirmPasswordInput} style={{flex: 1, color: Colors.danube}}  label="Confirm Password" value={confirmPassword} onChangeText={text => setConfirmPassword(text)} secureTextEntry={!visibleConfirmPassword} blurOnSubmit inputValidation={confirmPasswordValidation}/>
                            <FontAwesome name={confirmPasswordIcon} size={20} color={Colors.regentStBlue} onPress={() => setVisibleConfirmPassword(!visibleConfirmPassword)} style={{margin : 5}}/>
                        </View>
                        {confirmPasswordError &&
                        <View style={{alignSelf: 'flex-start', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(1)}}>
                            <Text style={{fontSize: RFValue(12), color: 'red'}}>{confirmPasswordError}</Text>
                        </View>
                        }
                        <TouchableOpacity onPress={submitHandler}>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(3), backgroundColor: Colors.funBlue, padding: 6}}>
                                <Text style={{fontSize: RFValue(16), color: 'white'}}>Create Account</Text>
                            </View>
                        </TouchableOpacity>
                        <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: RFValue(40), right: RFValue(15), alignSelf: 'flex-end'}} onPress={() => {
                            props.navigation.navigate('Login')
                        }}/>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: 6, marginTop:  RFPercentage(30),}}>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                            props.navigation.navigate('Login')
                        }}>
                            <Text style={{fontSize: RFValue(16), color: Colors.funBlue}}>Already have an account?</Text>
                            <Text style={{fontSize: RFValue(16), color: Colors.funBlue, fontWeight: 'bold'}}> Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {isLoading &&
                    <LoadingSpinner/>
                }
            </ScrollView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default SignUpScreen