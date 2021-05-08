import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import axios from 'axios';
import Avatar from '../../assets/icons/Avatar.png';
import Logo from '../../assets/teresa.png';
import Calendar from '../../assets/icons/Calendar.png';
import UploadPrescription from '../../assets/icons/UploadPrescriptionCard.png';
import Colors from '../../constants/Colors';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomAlert from '../../components/CustomAlert';
import {APP_BACKEND_URL} from "@env"

const HomeScreen = (props) => {
    const [token, setToken] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [upcomingSchedules, setUpcomingSchedules] = useState([])
    const [upcomingScheduleNumber, setUpcomingScheduleNumber] = useState(null)
    const getUserData = async() => {
        const userData = await AsyncStorage.getItem('userData')
        const tempUserData = JSON.parse(userData)
        setToken(tempUserData.token)
        props.navigation.setParams({
            name: tempUserData.firstName+' '+tempUserData.lastName
        })
        setIsRefreshing(true)
        setIsLoading(true)
        try {
            const response = await axios.get(APP_BACKEND_URL+'routines/upcoming/me', {
                headers: {
                    Authorization : `Bearer ${tempUserData.token}`
                }
            })
            setIsLoading(false)
            setUpcomingSchedules(response.data.message.upcomingSchedules)
            setUpcomingScheduleNumber(response.data.message.numberOfUpcomings)
        } catch (error) {
            setIsLoading(false)
            setErrorMessage(error.response.data.message)
        }
        setIsRefreshing(false)
    }
    const getUpcomingReminder = async() => {
        setIsRefreshing(true)
        setIsLoading(true)
        try {
            const response = await axios.get(APP_BACKEND_URL+'routines/upcoming/me', {
                headers: {
                    Authorization : `Bearer ${token}`
                }
            })
            setIsLoading(false)
            setUpcomingSchedules(response.data.message.upcomingSchedules)
            setUpcomingScheduleNumber(response.data.message.numberOfUpcomings)
        } catch (error) {
            setIsLoading(false)
            setErrorMessage(error.response.data.message)
        }
        setIsRefreshing(false)
    }
    useEffect(()=>{
        getUserData()
    }, [])
    useEffect(()=>{
        getUpcomingReminder()
    }, [])
    const timeFormat = (timeString) => {
        var time = timeString.split(":");
        var hour = time[0] % 12 || 12;
        var minute = time[1];
        var ampm = time[0] < 12 || time[0] === 24 ? "AM" : "PM";
        return hour + ":" + minute + " " + ampm;
    }
    const modalHandler = () => {
        setErrorMessage(null)
    }
    return <View style={styles.screen}>
        <ScrollView style={styles.screen} refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={getUpcomingReminder} />
        }>
            {errorMessage &&<CustomAlert message={errorMessage} onClear={modalHandler}/>}
            {
                upcomingSchedules.length > 0 &&
                <View style={styles.reminderCard}>
                    <View style={{width: '100%', backgroundColor: Colors.funBlue, paddingVertical: RFPercentage(1)}}>
                        <Text style={{fontSize: RFValue(16), color: 'white', marginLeft: 5}}>Next Reminder ({upcomingScheduleNumber} reminders)</Text>
                    </View>
                    <View style={{width: '100%', backgroundColor: 'white'}}>
                        {upcomingSchedules.map((item, i) => {
                            return <View style={{flexDirection: 'row', width: '100%'}} key={i}>
                                <Entypo name="dot-single" size={30} color={Colors.danube} />
                                <Text style={{color: Colors.kimberly, marginTop: 5}}>{item.unit} unit {item.medicineName} at {timeFormat(item.time)} {item.meal} meal</Text>
                            </View>
                        })}
                    </View>
                    <FontAwesome name="close" size={20} color='white' style={{position: 'absolute', top: 5, right: RFValue(10), alignSelf: 'flex-end'}} onPress={() => {
                        setUpcomingSchedules([])
                    }}/>
                </View>
            }
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('AboutTeresa')
            }}>
            <View style={styles.card}>
                <View style={styles.cardImage}>
                    <Image source={Logo} style={{width: RFValue(80), height: RFValue(80), resizeMode: 'contain' }}/>
                </View>
                <View style={{width: '60%'}}>
                    <Text style={styles.cardContentText1}>Why Teresa</Text>
                    <Text style={styles.cardContentText2}>Teresa will take care of your health the way your guardian or a nurse can do-</Text>
                    <Text style={styles.cardContentText2}>1. Teresa will give you reminders…</Text>
                    <Text style={styles.cardContentText2}>2. Teresa will keep all your records safe and easy to find for further reference…</Text>
                    <Text style={styles.cardContentText2}>3. Teresa will give you the easiest medicine order… (More)</Text>
                </View>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('SetReminder')
            }}>
                <View style={styles.card}>
                    <View style={styles.cardImage}>
                        <Image source={Calendar} style={{width: RFValue(100), height: RFValue(100), resizeMode: 'contain' }}/>
                    </View>
                    <View style={{width: '60%'}}>
                        <Text style={styles.cardContentText1}>Set Reminder</Text>
                        <Text style={styles.cardContentText2}>Discipline is important, it is more important for chronic patient as to maintain as per doctor's recommendation, and teresa is here to help with that.</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('UploadPrescription')
            }}>
                <View style={[styles.card, {marginBottom: RFPercentage(3)}]}>
                    <View style={styles.cardImage}>
                        <Image source={UploadPrescription} style={{width: RFValue(100), height: RFValue(100), resizeMode: 'contain' }}/>
                    </View>
                    <View style={{width: '60%'}}>
                        <Text style={styles.cardContentText1}>Upload Prescription</Text>
                        <Text style={styles.cardContentText2}>Before you run out your important medicine, Teresa gives you the opportunity to order medicine from home!</Text>
                    </View>
                </View>
            </TouchableOpacity>
            {isLoading &&
                <LoadingSpinner/>
            }
        </ScrollView>
        <TouchableOpacity style={{position: 'absolute', bottom: RFValue(5), right: RFValue(15), alignSelf: 'flex-end'}} onPress={() => {
            props.navigation.navigate('SetReminder')
        }}>
            <Entypo name="circle-with-plus" size={48} color={Colors.funBlue} />
        </TouchableOpacity>
    </View>
}

HomeScreen.navigationOptions = (navData) => {
    return {
        headerTitle: navData.navigation.getParam('name'),
        headerLeft: () => <Image style={{width: 32, height: 32, marginLeft: 10, resizeMode: 'contain'}} source={Avatar}/>
        // headerTitle: () => <View style={{flexDirection: 'row', alignItems: 'center'}}><Image style={{width: 32, height: 32, marginLeft: 10, resizeMode: 'contain'}} source={Avatar}/><Text style={{fontSize: RFValue(26), marginLeft: 5, color: Platform.OS === 'android' ? 'white' : Colors.funBlue, fontWeight: 'bold'}}>{navData.navigation.getParam('name')}</Text></View>
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    reminderCard: {
        flex: 1, 
        marginHorizontal: RFPercentage(3),
        marginTop: RFPercentage(3),
        borderWidth: 1,
        borderColor: Colors.alto,
        marginBottom: 5,
        shadowColor: Colors.black, 
        shadowOffset: { 
            width: 0, 
            height: 2 
        }, 
        shadowOpacity: Platform.OS == 'android' ? 0.8 : 0.3, 
        shadowRadius: Platform.OS == 'android' ? 40 : 5, 
        elevation: 3
    },
    card: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 15, 
        marginHorizontal: RFPercentage(3),
        marginTop: RFPercentage(3),
        borderWidth: 1, 
        borderColor: Colors.alto, 
        shadowColor: Colors.black, 
        shadowOffset: { 
            width: 0, 
            height: 2 
        }, 
        shadowOpacity: Platform.OS == 'android' ? 0.8 : 0.3, 
        shadowRadius: Platform.OS == 'android' ? 40 : 5, 
        elevation: 3, 
        backgroundColor: 'white'
    },
    cardImage: {
        width: '40%', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    cardContentText1: {
        fontSize: RFPercentage(3), 
        fontWeight: 'bold', 
        color: Colors.deepSapphire
    },
    cardContentText2: {
        fontSize: RFValue(9), 
        lineHeight: 15, 
        fontWeight: 'bold', 
        color: Colors.kimberly
    }
})

export default HomeScreen