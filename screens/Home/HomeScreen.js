import React, {useEffect} from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Avatar from '../../assets/icons/Avatar.png';
import Logo from '../../assets/teresa.png';
import Calendar from '../../assets/icons/Calendar.png';
import UploadPrescription from '../../assets/icons/UploadPrescriptionCard.png';
import Colors from '../../constants/Colors';
import { FontAwesome, Entypo } from '@expo/vector-icons';

const HomeScreen = (props) => {
    const getUserData = async() => {
        const userData = await AsyncStorage.getItem('userData')
        const tempUserData = JSON.parse(userData)
        props.navigation.setParams({
            name: tempUserData.firstName+' '+tempUserData.lastName
        })
    }
    useEffect(()=>{
        getUserData()
    }, [])
    return <View style={styles.screen}>
        <ScrollView style={styles.screen}>
            <View style={styles.reminderCard}>
                <View style={{width: '100%', backgroundColor: Colors.funBlue, paddingVertical: RFPercentage(1)}}>
                    <Text style={{fontSize: RFValue(16), color: 'white', marginLeft: 5}}>Next Reminder (2 reminders)</Text>
                </View>
                <View style={{width: '100%', backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row', width: '100%'}}>
                        <Entypo name="dot-single" size={30} color={Colors.danube} />
                        <Text style={{color: Colors.kimberly, marginTop: 5}}>1 unit Napa at 8:00 AM after meal</Text>
                    </View>
                    <View style={{flexDirection: 'row', width: '100%'}}>
                        <Entypo name="dot-single" size={30} color={Colors.danube} />
                        <Text style={{color: Colors.kimberly, marginTop: 5}}>1 unit Pantonix at 10:00 AM before meal</Text>
                    </View>
                </View>
                <FontAwesome name="close" size={20} color='white' style={{position: 'absolute', top: 5, right: RFValue(10), alignSelf: 'flex-end'}}/>
            </View>
            <View style={styles.card}>
                <View style={styles.cardImage}>
                    <Image source={Logo} style={{width: RFValue(80), height: RFValue(80), resizeMode: 'contain' }}/>
                </View>
                <View style={{width: '60%'}}>
                    <Text style={styles.cardContentText1}>What is Teresa</Text>
                    <Text style={styles.cardContentText2}>Teresa is a medication management service, specially designed to assist people taking medicine in time. Proper meditation is very important to maintain healthcare tasks in line.</Text>
                </View>
            </View>
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