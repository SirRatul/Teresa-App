import React, {useState, useRef} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import Logo from '../../assets/teresa.png';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import CustomAlert from '../../components/CustomAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import {APP_BACKEND_URL} from "@env"

const ResetPassScreen = (props) => {
    const confirmNewPasswordInput = useRef(null)
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordError, setNewPasswordError] = useState(null)
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(null)
    const [visibleNewPassword, setVisibleNewPassword] = useState(false)
    const [visibleConfirmNewPassword, setVisibleConfirmNewPassword] = useState(false)
    const newPasswordIcon = !visibleNewPassword ? 'eye-slash' : 'eye';
    const confirmNewPasswordIcon = !visibleConfirmNewPassword ? 'eye-slash' : 'eye';
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const phoneNumber = props.navigation.getParam('phoneNumber')
    const otp = props.navigation.getParam('otp')
    const newPasswordValidation = (value) => {
        if(!value){
            setNewPasswordError('Invalid New Password')
        } else {
            setNewPasswordError(null)
        }
    }
    const confirmNewPasswordValidation = (value) => {
        if(!value){
            setConfirmNewPasswordError('Invalid Confirm New Password')
        } else {
            setConfirmNewPasswordError(null)
        }
    }
    const submitHandler = async() => {
        if(!newPasswordError && !confirmNewPasswordError && newPassword && confirmNewPassword){
            Keyboard.dismiss()
            if(newPassword !== confirmNewPassword){
                setErrorMessage('Passwords do not match')
            } else {
                setIsLoading(true)
                try {
                    const response = await axios.post(APP_BACKEND_URL+'users/new-pass', {
                        phone: '88'+phoneNumber,
                        otp,
                        password: newPassword
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
                </View>
                <View style={{flexDirection: 'row', marginTop: RFPercentage(5), marginHorizontal: RFPercentage(3), backgroundColor: Colors.blackSqueeze, padding: 5}}>
                    <FloatingLabelInput style={{flex: 1, color: Colors.danube}} onChangeText={text => setNewPassword(text)} value={newPassword} label='Password' secureTextEntry={!visibleNewPassword} blurOnSubmit={false} returnKeyType="next" onSubmitEditing={() => confirmNewPasswordInput.current.focus()} inputValidation={newPasswordValidation}/>
                    <FontAwesome name={newPasswordIcon} size={20} color={Colors.regentStBlue} onPress={() => setVisibleNewPassword(!visibleNewPassword)} style={{margin : 5}}/>
                </View>
                {newPasswordError &&
                <View style={{alignSelf: 'flex-start', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(1)}}>
                    <Text style={{fontSize: RFValue(12), color: 'red'}}>{newPasswordError}</Text>
                </View>
                }
                <View style={{flexDirection: 'row', marginTop: RFPercentage(5), marginHorizontal: RFPercentage(3), backgroundColor: Colors.blackSqueeze, padding: 5}}>
                    <FloatingLabelInput myRef={confirmNewPasswordInput} style={{flex: 1, color: Colors.danube}} onChangeText={text => setConfirmNewPassword(text)} value={confirmNewPassword} label='Confirm Password' secureTextEntry={!visibleConfirmNewPassword} blurOnSubmit inputValidation={confirmNewPasswordValidation}/>
                    <FontAwesome name={confirmNewPasswordIcon} size={20} color={Colors.regentStBlue} onPress={() => setVisibleConfirmNewPassword(!visibleConfirmNewPassword)} style={{margin : 5}}/>
                </View>
                {confirmNewPasswordError &&
                <View style={{alignSelf: 'flex-start', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(1)}}>
                    <Text style={{fontSize: RFValue(12), color: 'red'}}>{confirmNewPasswordError}</Text>
                </View>
                }
                <TouchableOpacity onPress={submitHandler}>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(3), backgroundColor: Colors.funBlue, padding: 6}}>
                        <Text style={{fontSize: RFValue(16), color: 'white'}}>Reset</Text>
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

export default ResetPassScreen