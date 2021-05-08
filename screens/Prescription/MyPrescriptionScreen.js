import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, RefreshControl, ScrollView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Avatar from '../../assets/icons/Avatar.png';
import PrescriptionPhoto from '../../assets/icons/prescriptionPhoto.png';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import CustomAlert from '../../components/CustomAlert';
import PhotoShowModal from '../../components/PhotoShowModal';
import moment from 'moment';
import NoPrescription from '../../assets/icons/NoPrescription.jpg';
import {APP_BACKEND_URL} from "@env"

const MyPrescriptionScreen = (props) => {
    const [token, setToken] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [prescriptionId, setPrescriptionId] = useState(null)
    const [todayPrescription, setTodayPrescription] = useState([])
    const [yesterdayPrescription, setYesterdayPrescription] = useState([])
    const [otherDayPrescription, setOtherDayPrescription] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const [photoShowModal, setPhotoShowModal] = useState(false)
    const [pickedImage, setPickedImage] = useState(null)
    const getUserData = async() => {
        const userData = await AsyncStorage.getItem('userData')
        const tempUserData = JSON.parse(userData)
        setToken(tempUserData.token)
        setIsRefreshing(true)
        console.log(APP_BACKEND_URL)
        console.log(tempUserData.token)
        try {
            const response = await axios.get(APP_BACKEND_URL+'files/prescription', {
                headers: {
                    Authorization : `Bearer ${tempUserData.token}`
                }
            })
            console.log(response.data.message)
            if(response.data.message != 'You do not have any prescription'){
                tempArray = response.data.message
                tempArray.sort(function(a,b){
                    return new Date(b.creation_date) - new Date(a.creation_date)
                })
                var currentDate = new Date().toISOString().substring(0, new Date().toISOString().indexOf('T'));
                var previousDate = moment().add(-1, 'days');
                var previousDay = previousDate.toISOString().substring(0, previousDate.toISOString().indexOf('T'));
                var today = []
                var yesterday = []
                var other = []
                tempArray.forEach((tempData) => {
                    var tempDate = tempData.creation_date.substring(0, tempData.creation_date.indexOf('T'));
                    if(tempDate.localeCompare(currentDate) == 0){
                        today.push(tempData)
                    } else if(tempDate.localeCompare(previousDay) == 0){
                        yesterday.push(tempData)
                    } else {
                        other.push(tempData)
                    }
                })
                setTodayPrescription(today)
                setYesterdayPrescription(yesterday)
                setOtherDayPrescription(other)
            }
        } catch (error) {
            setErrorMessage(error.response.data.message)
            console.log(error)
        }
        setIsRefreshing(false)
    }
    const authAxios = axios.create({
        baseURL: APP_BACKEND_URL,
        headers: {
            Authorization : `Bearer ${token}`
        }
    })
    useEffect(()=>{
        getUserData()
    }, [])
    const showImageHandler = (imageUri, prescriptionId) => {
        setPickedImage(imageUri)
        setPrescriptionId(prescriptionId)
        setPhotoShowModal(true)
    }
    const modalHandler = () => {
        setPickedImage(null)
        setErrorMessage(null)
        setPhotoShowModal(false)
        setPrescriptionId(null)
    }
    const orderHandler = (imageUrl) => {
        modalHandler()
        props.navigation.navigate('UploadPrescription', { 
            imageUrl,
            prescriptionId
        })
    }
    return <ScrollView style={{ flex: 1 }} refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={getUserData}/>
      }>
        <View style={styles.screen, {backgroundColor: todayPrescription.length == 0 && yesterdayPrescription.length == 0 && otherDayPrescription.length == 0 && '#F8F9FB'}}>
            {errorMessage &&<CustomAlert message={errorMessage} onClear={modalHandler}/>}
            {photoShowModal &&<PhotoShowModal onClear={modalHandler} imageUri={pickedImage} prescriptionId={prescriptionId} orderHandler={orderHandler}/>}
            {
                todayPrescription.length > 0 || yesterdayPrescription.length > 0 || otherDayPrescription.length > 0 ?
                <>
                {
                    todayPrescription.length > 0 &&
                    <View style={{marginHorizontal: RFPercentage(3)}}>
                        <Text style={{marginTop: RFPercentage(4), marginLeft: RFPercentage(3), fontSize: 18, color: Colors.rhino}}>Today</Text>
                        <FlatList data={todayPrescription} keyExtractor={(item) => item.prescriptionId} numColumns={2} renderItem={(itemData) => {
                            return <View style={{width: '40%', justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3)}}>
                            <TouchableOpacity onPress={() => {showImageHandler(itemData.item.path, itemData.item.prescriptionId)}}>
                                <Image style={{width: RFValue(200), height: RFValue(200), resizeMode: 'contain', marginTop: RFPercentage(2)}} source={{
                                    uri: 'https://'+itemData.item.path
                                }}/>
                            </TouchableOpacity>
                            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: Colors.amethystSmoke, fontSize: RFValue(15)}}>{itemData.item.code}</Text>
                                <Text style={{color: Colors.amethystSmoke, fontSize: RFValue(15)}}>Date: {moment(itemData.item.creation_date,'DD/MM/YYYY').format('DD-MM-YYYY')}</Text>
                            </View>
                        </View>
                        }}/>
                    </View>
                }
                {
                    yesterdayPrescription.length > 0 &&
                    <View style={{marginHorizontal: RFPercentage(3)}}>
                        <Text style={{marginTop: RFPercentage(4), marginLeft: RFPercentage(3), fontSize: 18, color: Colors.rhino}}>Yesterday</Text>
                        <FlatList data={yesterdayPrescription} keyExtractor={(item) => item.prescriptionId} numColumns={2} renderItem={(itemData) => {
                            return <View style={{width: '40%', justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3)}}>
                            <TouchableOpacity onPress={() => {showImageHandler(itemData.item.path, itemData.item.prescriptionId)}}>
                                <Image style={{width: RFValue(200), height: RFValue(200), resizeMode: 'contain', marginTop: RFPercentage(2)}} source={{
                                    uri: 'https://'+itemData.item.path
                                }}/>
                            </TouchableOpacity>
                            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: Colors.amethystSmoke, fontSize: RFValue(15)}}>{itemData.item.code}</Text>
                                <Text style={{color: Colors.amethystSmoke, fontSize: RFValue(15)}}>Date: {moment(itemData.item.creation_date,'DD/MM/YYYY').format('DD-MM-YYYY')}</Text>
                            </View>
                        </View>
                    }}/>
                    </View>
                }
                {
                    otherDayPrescription.length > 0 &&
                    <View style={{marginHorizontal: RFPercentage(3)}}>
                        <Text style={{marginTop: RFPercentage(4), marginLeft: RFPercentage(3), fontSize: 18, color: Colors.rhino}}>Previous</Text>
                        <FlatList data={otherDayPrescription} keyExtractor={(item) => item.prescriptionId} numColumns={2} renderItem={(itemData) => {
                            return <View style={{width: '40%', justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3)}}>
                            <TouchableOpacity onPress={() => {showImageHandler(itemData.item.path, itemData.item.prescriptionId)}}>
                                <Image style={{width: RFValue(200), height: RFValue(200), resizeMode: 'contain', marginTop: RFPercentage(2)}} source={{
                                    uri: 'https://'+itemData.item.path
                                }}/>
                            </TouchableOpacity>
                            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: Colors.amethystSmoke, fontSize: RFValue(15)}}>{itemData.item.code}</Text>
                                <Text style={{color: Colors.amethystSmoke, fontSize: RFValue(15)}}>Date: {moment(itemData.item.creation_date,'DD/MM/YYYY').format('DD-MM-YYYY')}</Text>
                            </View>
                        </View>
                        }}/>
                    </View>
                }
                </>
                :
                <>
                <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - RFPercentage(30), resizeMode: 'contain'}} source={NoPrescription}/>
                <TouchableOpacity onPress={() => {props.navigation.navigate('UploadPrescription')}} style={{marginBottom: RFPercentage(3)}}>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), backgroundColor: Colors.funBlue, padding: 6}}>
                        <Text style={{fontSize: RFValue(18), color: 'white'}}>Upload Prescription</Text>
                    </View>
                </TouchableOpacity> 
                </>
            }
            <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: RFValue(10), right: RFPercentage(3), alignSelf: 'flex-end'}} onPress={() => {
                props.navigation.navigate('Home')
            }}/>
        </View>
    </ScrollView>
}

MyPrescriptionScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'My Prescription',
        headerRight: () => <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={Avatar}/>
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        
    }
})

export default MyPrescriptionScreen