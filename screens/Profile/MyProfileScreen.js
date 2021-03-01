import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TextInput, TouchableWithoutFeedback, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import Avatar from '../../assets/icons/Avatar.png';
import Colors from '../../constants/Colors';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import CustomAlert from '../../components/CustomAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import moment from 'moment';
import {APP_BACKEND_URL} from "@env"

const MyProfileScreen = (props) => {
    const [token, setToken] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [userId, setUserId] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState()
    const [dateOfBirthPickerShow, setDateOfBirthPickerShow] = useState(false)
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const authAxios = axios.create({
        baseURL: 'https://teresa-server.herokuapp.com',
        headers: {
            Authorization : `Bearer ${token}`
        }
    })
    const getUserData = async() => {
        const userData = await AsyncStorage.getItem('userData')
        const tempUserData = JSON.parse(userData)
        setToken(tempUserData.token)
        setUserId(tempUserData.userId)
        setIsRefreshing(true)
        try {
            const response = await axios.get(APP_BACKEND_URL+'users/me', {
                headers: {
                    Authorization : `Bearer ${tempUserData.token}`
                }
            })
            console.log(response.data)
            setFirstName(response.data.message.firstName)
            setLastName(response.data.message.lastName)
            setFullName(response.data.message.firstName+' '+response.data.message.lastName)
            if(response.data.message.email){
                setEmail(response.data.message.email)
            }
            if(response.data.message.dob != 'Invalid date'){
                setDateOfBirth(new Date(response.data.message.dob))
            } else {
                setDateOfBirth(new Date())
            }
            if(response.data.message.height){
                setHeight(response.data.message.height)
            }
            if(response.data.message.weight){
                setWeight(response.data.message.weight.toString())
            }
            if(response.data.message.address){
                setAddress(response.data.message.address)
            }
            setPhoneNumber(response.data.message.phone.substring(2))
        } catch (error) {
            console.log(error.response.data)
            setErrorMessage(error.response.data.message)
        }
        setIsRefreshing(false)
    }
    useEffect(()=>{
        getUserData()
    }, [])
    const dateOfBirthChange = (event, selectedValue) => {
        setDateOfBirthPickerShow(Platform.OS === 'ios')
        const selectedDate = selectedValue || dateOfBirth
        setDateOfBirth(selectedDate)
    }
    const showDateOfBirthpicker = () => {
        setDateOfBirthPickerShow(true)
    }
    const submitHandler = async() => {
        if(!firstName || !lastName){
            setErrorMessage('Name is required')
        } else{
            setIsLoading(true)
            try {
                const response = await authAxios.patch('/users/me', {
                    firstName,
                    lastName,
                    email,
                    dob: moment(dateOfBirth).format('YYYY-MM-DD'),
                    address,
                    height,
                    weight: parseInt(weight)
                })
                console.log(response.data)
                setIsLoading(false)
                setErrorMessage('Updated Successfully')
                setFullName(firstName+' '+lastName)
                AsyncStorage.setItem('userData', JSON.stringify({
                    token,
                    userId,
                    firstName,
                    lastName,
                    phone: phoneNumber,
                    address
                }))
            } catch (error) {
                setIsLoading(false)
                setErrorMessage(error.response.data.message)
            }
        }
    }
    const modalHandler = () => {
        setErrorMessage(null)
    }
    return <View style={styles.screen}>
        <ScrollView style={styles.screen} refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={getUserData} />
        }>
            {errorMessage &&<CustomAlert message={errorMessage} onClear={modalHandler}/>}
            <View style={{backgroundColor: Colors.linkWater, justifyContent: 'center', alignItems: 'center'}}>
                <Image style={{width: 64, height: 64, marginTop: RFPercentage(3), resizeMode: 'contain'}} source={Avatar}/>
                <Text style={{fontSize: RFValue(20), marginTop: RFPercentage(1), marginBottom: RFPercentage(3), color: Colors.catalinaBlue}}>{fullName}</Text>
            </View>
            <Text style={{marginHorizontal: RFPercentage(3), marginVertical: RFPercentage(3), fontSize: RFValue(22), color: Colors.resolutionBlue, fontWeight: 'bold'}}>General Information</Text>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 1, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>First Name</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.inputFieldBackground}}>
                    <TextInput style={{width: '100%', paddingHorizontal: 8}} textAlign={'center'} value={firstName} onChangeText={text => setFirstName(text)}/>
                </View>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 1, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Last Name</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.inputFieldBackground}}>
                    <TextInput style={{width: '100%', paddingHorizontal: 8}} value={lastName} onChangeText={text => setLastName(text)} textAlign={'center'}/>
                </View>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 1, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Email</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.inputFieldBackground}}>
                    <TextInput style={{width: '100%', paddingHorizontal: 8}} value={email} onChangeText={text => setEmail(text)} keyboardType='email-address' textAlign={'left'}/>
                </View>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 1, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Date of Birth</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.inputFieldBackground, flexDirection: 'row'}}>
                    <View style={{width: '100%', marginLeft: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableWithoutFeedback onPress={showDateOfBirthpicker}>
                            <Text style={{paddingHorizontal: 8}}>{moment(dateOfBirth).format('YYYY-MM-DD')}</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <FontAwesome name="calendar" style={{alignItems: 'flex-end', marginLeft: -RFValue(25)}} size={18} color={Colors.danube} onPress={showDateOfBirthpicker} />
                </View>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 1, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Height</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.inputFieldBackground}}>
                    {Platform.OS == 'android' ?
                        <>
                        <Picker
                            selectedValue={height}
                            style={{width: '100%', height: 30, backgroundColor: 'transparent', paddingHorizontal: 8}}
                            onValueChange={(itemValue, itemIndex) => setHeight(itemValue)}
                        >
                            <Picker.Item color={Colors.danube} label="Select Height"/>
                            <Picker.Item color={Colors.danube} label="4 feet" value="4 feet" />
                            <Picker.Item color={Colors.danube} label="4 feet 1 inch" value="4 feet 1 inch" />
                            <Picker.Item color={Colors.danube} label="4 feet 2 inch" value="4 feet 2 inch" />
                            <Picker.Item color={Colors.danube} label="4 feet 3 inch" value="4 feet 3 inch" />
                            <Picker.Item color={Colors.danube} label="4 feet 4 inch" value="4 feet 4 inch" />
                            <Picker.Item color={Colors.danube} label="4 feet 5 inch" value="4 feet 5 inch" />
                            <Picker.Item color={Colors.danube} label="4 feet 6 inch" value="4 feet 6 inch" />
                            <Picker.Item color={Colors.danube} label="4 feet 7 inch" value="4 feet 7 inch" />
                            <Picker.Item color={Colors.danube} label="4 feet 8 inch" value="4 feet 8 inch" />
                            <Picker.Item color={Colors.danube} label="4 feet 9 inch" value="4 feet 9 inch" />
                            <Picker.Item color={Colors.danube} label="4 feet 10 inch" value="4 feet 10 inch" />
                            <Picker.Item color={Colors.danube} label="4 feet 11 inch" value="4 feet 11 inch" />
                            <Picker.Item color={Colors.danube} label="5 feet" value="5 feet" />
                            <Picker.Item color={Colors.danube} label="5 feet 1 inch" value="5 feet 1 inch" />
                            <Picker.Item color={Colors.danube} label="5 feet 2 inch" value="5 feet 2 inch" />
                            <Picker.Item color={Colors.danube} label="5 feet 3 inch" value="5 feet 3 inch" />
                            <Picker.Item color={Colors.danube} label="5 feet 4 inch" value="5 feet 4 inch" />
                            <Picker.Item color={Colors.danube} label="5 feet 5 inch" value="5 feet 5 inch" />
                            <Picker.Item color={Colors.danube} label="5 feet 6 inch" value="5 feet 6 inch" />
                            <Picker.Item color={Colors.danube} label="5 feet 7 inch" value="5 feet 7 inch" />
                            <Picker.Item color={Colors.danube} label="5 feet 8 inch" value="5 feet 8 inch" />
                            <Picker.Item color={Colors.danube} label="5 feet 9 inch" value="5 feet 9 inch" />
                            <Picker.Item color={Colors.danube} label="5 feet 10 inch" value="5 feet 10 inch" />
                            <Picker.Item color={Colors.danube} label="5 feet 11 inch" value="5 feet 11 inch" />
                            <Picker.Item color={Colors.danube} label="6 feet" value="6 feet" />
                            <Picker.Item color={Colors.danube} label="6 feet 1 inch" value="6 feet 1 inch" />
                            <Picker.Item color={Colors.danube} label="6 feet 2 inch" value="6 feet 2 inch" />
                            <Picker.Item color={Colors.danube} label="6 feet 3 inch" value="6 feet 3 inch" />
                            <Picker.Item color={Colors.danube} label="6 feet 4 inch" value="6 feet 4 inch" />
                            <Picker.Item color={Colors.danube} label="6 feet 5 inch" value="6 feet 5 inch" />
                        </Picker>
                        <AntDesign name="caretdown" style={{position: "absolute", right: RFValue(6)}} size={12} color={Colors.danube}/>
                        </>
                        :
                        <TouchableOpacity onPress={() => {
                            ActionSheetIOS.showActionSheetWithOptions(
                                {
                                  options: ["Select Height", "4 feet", "4 feet 1 inch", "4 feet 2 inch", "4 feet 3 inch", "4 feet 4 inch", "4 feet 5 inch", "4 feet 6 inch", "4 feet 7 inch", "4 feet 8 inch", "4 feet 9 inch", "4 feet 10 inch", "4 feet 11 inch", "5 feet", "5 feet 1 inch", "5 feet 2 inch", "5 feet 3 inch", "5 feet 4 inch", "5 feet 5 inch", "5 feet 6 inch", "5 feet 7 inch", "5 feet 8 inch", "5 feet 9 inch", "5 feet 10 inch", "5 feet 11 inch", "6 feet", "6 feet 1 inch", "6 feet 2 inch", "6 feet 3 inch", "6 feet 4 inch", "6 feet 5 inch", "Cancel"],
                                  destructiveButtonIndex: 32,
                                  userInterfaceStyle: 'dark'
                                },
                                (buttonIndex) => {
                                    switch(buttonIndex) {
                                        case 1:
                                            setHeight('4 feet')
                                            break;
                                        case 2:
                                            setHeight('4 feet 1 inch')
                                            break;
                                        case 3:
                                            setHeight('4 feet 2 inch')
                                            break;
                                        case 4:
                                            setHeight('4 feet 3 inch')
                                            break;
                                        case 5:
                                            setHeight('4 feet 4 inch')
                                            break;
                                        case 6:
                                            setHeight('4 feet 5 inch')
                                            break;
                                        case 7:
                                            setHeight('4 feet 6 inch')
                                            break;
                                        case 8:
                                            setHeight('4 feet 7 inch')
                                            break;
                                        case 9:
                                            setHeight('4 feet 8 inch')
                                            break;
                                        case 10:
                                            setHeight('4 feet 9 inch')
                                            break;
                                        case 11:
                                            setHeight('4 feet 10 inch')
                                            break;
                                        case 12:
                                            setHeight('4 feet 11 inch')
                                            break;
                                        case 13:
                                            setHeight('5 feet')
                                            break;
                                        case 14:
                                            setHeight('5 feet 1 inch')
                                            break;
                                        case 15:
                                            setHeight('5 feet 2 inch')
                                            break;
                                        case 16:
                                            setHeight('5 feet 3 inch')
                                            break;
                                        case 17:
                                            setHeight('5 feet 4 inch')
                                            break;
                                        case 18:
                                            setHeight('5 feet 5 inch')
                                            break;
                                        case 19:
                                            setHeight('5 feet 6 inch')
                                            break;
                                        case 20:
                                            setHeight('5 feet 7 inch')
                                            break;
                                        case 21:
                                            setHeight('5 feet 8 inch')
                                            break;
                                        case 22:
                                            setHeight('5 feet 9 inch')
                                            break;
                                        case 23:
                                            setHeight('5 feet 10 inch')
                                            break;
                                        case 24:
                                            setHeight('5 feet 11 inch')
                                            break;
                                        case 25:
                                            setHeight('6 feet')
                                            break;
                                        case 26:
                                            setHeight('6 feet 1 inch')
                                            break;
                                        case 27:
                                            setHeight('6 feet 2 inch')
                                            break;
                                        case 28:
                                            setHeight('6 feet 3 inch')
                                            break;
                                        case 29:
                                            setHeight('6 feet 4 inch')
                                            break;
                                        case 30:
                                            setHeight('6 feet 5 inch')
                                            break;
                                    }
                                }
                            )                         
                        }}>
                            <View style={{width: '100%', flexDirection:'row'}}>
                                <TextInput style={{width: '100%'}} value={mealState} keyboardType='numeric' editable={false} textAlign={'center'}/>
                                <AntDesign name="caretdown" style={{position: "absolute", right: RFValue(6), top: RFValue(6)}} size={12} color={Colors.danube}/>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 1, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Weight</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.inputFieldBackground}}>
                    <TextInput style={{width: '100%', paddingHorizontal: 8}} value={weight} onChangeText={text => setWeight(text)} keyboardType={'numeric'} textAlign={'center'}/>
                </View>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 1, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Address</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.inputFieldBackground}}>
                    <TextInput style={{width: '100%', paddingHorizontal: 8}} value={address} onChangeText={text => setAddress(text)} textAlign={'center'}/>
                </View>
            </View>
            <Text style={{marginHorizontal: RFPercentage(3), marginVertical: RFPercentage(3), fontSize: RFValue(22), color: Colors.resolutionBlue, fontWeight: 'bold'}}>Account Information</Text>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 1, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Phone Number</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.inputFieldBackground, flexDirection: 'row'}}>
                    <View style={{width: '30%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 2, borderRightColor: Colors.spindle}}>
                        <Text style={{color: Colors.danube}}>+88</Text>
                    </View>
                    <TextInput style={{width: '70%', paddingHorizontal: 8}} value={phoneNumber} onChangeText={text => setPhoneNumber(text)} editable = {false} textAlign={'center'}/>
                </View>
            </View>
            <TouchableOpacity onPress={submitHandler}>
                <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(3), marginBottom: RFPercentage(6), backgroundColor: Colors.funBlue, padding: 6}}>
                    <Text style={{fontSize: RFValue(16), color: 'white'}}>Update</Text>
                </View>
            </TouchableOpacity>
            {dateOfBirthPickerShow && <DateTimePicker
                value={dateOfBirth}
                mode={'date'}
                display='default'
                onChange={dateOfBirthChange}
            />
            }
            <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: RFValue(10), right: RFValue(15), alignSelf: 'flex-end'}} onPress={() => {
                props.navigation.navigate('Home')
            }}/>
            {isLoading &&
                <LoadingSpinner/>
            }
        </ScrollView>
    </View>
}

MyProfileScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'My Profile'
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default MyProfileScreen