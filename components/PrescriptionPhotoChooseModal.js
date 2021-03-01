import React, {useState, useEffect} from 'react';
import { View, Text, Modal, RefreshControl, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import PrescriptionPhoto from '../assets/icons/prescriptionPhoto.png';
import { AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Colors from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomAlert from './CustomAlert';
import {APP_BACKEND_URL} from "@env"
import moment from 'moment';

const PrescriptionPhotoChooseModal = (props) => {
  const [token, setToken] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [prescriptionDetails, setPrescriptionDetails] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const getUserData = async() => {
    const userData = await AsyncStorage.getItem('userData')
    const tempUserData = JSON.parse(userData)
    setToken(tempUserData.token)
    setIsRefreshing(true)
    try {
        const response = await axios.get(APP_BACKEND_URL+'files/prescription', {
            headers: {
                Authorization : `Bearer ${tempUserData.token}`
            }
        })
        setPrescriptionDetails(response.data.message)
    } catch (error) {
        setErrorMessage(error.response.data.message)
    }
    setIsRefreshing(false)
  }
  useEffect(()=>{
    getUserData()
  }, [])
  const modalHandler = () => {
    setErrorMessage(null)
  }
  return <Modal animationType="slide" transparent={true} visible={true} onRequestClose={props.onClear}>
    <ScrollView style={{ flex: 1, backgroundColor: 'white'}} refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={getUserData} />
    }>
      {errorMessage &&<CustomAlert message={errorMessage} onClear={modalHandler}/>}
      <View style={{marginTop: RFPercentage(3)}}/>
      <FlatList data={prescriptionDetails} keyExtractor={(item) => item.prescriptionId} numColumns={2} renderItem={(itemData) => {
        return <View style={{width: '40%', justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3)}}>
        <TouchableOpacity /* onPress={() => {props.chooseImage(itemData.item.path)}} */ onPress={() => {props.chooseImage('https://avatars2.githubusercontent.com/u/7970947?v=3&s=460')}}>
            <Image style={{width: RFValue(200), height: RFValue(200), resizeMode: 'contain', marginTop: RFPercentage(2)}} source={PrescriptionPhoto}/>
        </TouchableOpacity>
        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: Colors.amethystSmoke, fontSize: RFValue(15)}}>{itemData.item.code}</Text>
            <Text style={{color: Colors.amethystSmoke, fontSize: RFValue(15)}}>Date: {moment(itemData.item.creation_date).format('DD-MM-YYYY')}</Text>
        </View>
      </View>
      }}/>
    </ScrollView>
    <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: RFValue(10), right: RFValue(10), alignSelf: 'flex-end'}} onPress={props.onClear}/>
  </Modal>
}
 
export default PrescriptionPhotoChooseModal