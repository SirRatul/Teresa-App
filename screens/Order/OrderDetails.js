import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, RefreshControl, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Avatar from '../../assets/icons/Avatar.png';
import Sorry from '../../assets/icons/Sorry_Invoice.jpg';
import moment from 'moment';
import {APP_BACKEND_URL} from "@env"

const OrderDetails = (props) => {
    const [token, setToken] = useState('')
    const [invoiceStatus, setInvoiceStatus] = useState(props.navigation.getParam('invoiceStatus') == 'Not Created' && false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [orderTime, setOrderTime] = useState(null)
    const [medicineDetails, setMedicineDetails] = useState([])
    const [totalPrice, setTotalPrice] = useState(null)
    const [billName, setBillName] = useState(null)
    const [billPhone, setBillPhone] = useState(null)
    const [billAddress, setBillAddress] = useState(null)
    const [sellerName, setSellerName] = useState(null)
    const [sellerPhone, setSellerPhone] = useState(null)
    const getOrderData = async() => {
        if(props.navigation.getParam('invoiceStatus') == 'Created'){
            setInvoiceStatus(true)
            const userData = await AsyncStorage.getItem('userData')
            const tempUserData = JSON.parse(userData)
            setToken(tempUserData.token)
            setIsRefreshing(true)
            try {
                const response = await axios.get(APP_BACKEND_URL+'orders/prescription/'+props.navigation.getParam('orderNo'), {
                    headers: {
                        Authorization : `Bearer ${tempUserData.token}`
                    }
                })
                setOrderTime(response.data.message[0].dateTime)
                setMedicineDetails(response.data.message[0].medicineDetails)
                setTotalPrice(response.data.message[0].totalPrice)
                setBillName(response.data.message[0].billName)
                setBillPhone(response.data.message[0].billPhone)
                setBillAddress(response.data.message[0].billAddress)
                setSellerName(response.data.message[0].sellerName)
                setSellerPhone(response.data.message[0].sellerPhone)
            } catch (error) {
            }
            setIsRefreshing(false)
        }
    }
    const authAxios = axios.create({
        baseURL: APP_BACKEND_URL,
        headers: {
            Authorization : `Bearer ${token}`
        }
    })
    useEffect(()=>{
        getOrderData()
    }, [])
    return <ScrollView style={[styles.screen, {backgroundColor: 'white'}]} refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={getOrderData} />
    }>
        {
            invoiceStatus ?
            <>
            <View style={{marginVertical: RFPercentage(7), marginHorizontal: RFPercentage(3), justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <Text style={{color: Colors.catalinaBlue, fontWeight: 'bold', fontSize: RFValue(22)}}>Order No: {props.navigation.getParam('orderNo')}</Text>
                <Text style={{color: Colors.funBlue, fontSize: RFValue(15)}}>Date and Time: {moment(orderTime,'DD/MM/YYYY hh:mm a').format('DD-MM-YYYY hh:mm A')}</Text>
            </View>
            <View style={{marginHorizontal: RFPercentage(3), flexDirection: 'row'}}>
                <View style={{width: '40%', marginLeft: RFPercentage(2)}}>
                    <Text>Medicine Name</Text>
                </View>
                <View style={{width: '25%', justifyContent: 'center', alignItems: 'center', marginLeft: RFPercentage(2)}}>
                    <Text>Unit</Text>
                </View>
                <View style={{width: '25%', justifyContent: 'center', alignItems: 'center', marginLeft: RFPercentage(2)}}>
                    <Text>Price</Text>
                </View>
            </View>
            {medicineDetails.map((x, i) => {
                return (
                    <View style={{marginHorizontal: RFPercentage(3), marginTop: RFValue(10), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}} key={i}>
                        <View style={{width: '40%', backgroundColor: Colors.blackSqueeze, padding: 6, marginRight: RFPercentage(2)}}>
                            <TextInput
                                style={{width: '100%', color: Colors.danube}}
                                value={x.medicineName}
                                editable={false}
                                textAlign={'center'}
                            />
                        </View>
                        <View style={{width: '25%', backgroundColor: Colors.blackSqueeze, padding: 6, marginLeft: RFPercentage(2)}}>
                            <TextInput
                                style={{width: '100%', color: Colors.danube}}
                                value={x.unit.toString()}
                                editable={false}
                                textAlign={'center'}
                            />
                        </View>
                        <View style={{width: '25%', backgroundColor: Colors.blackSqueeze, padding: 6, marginLeft: RFPercentage(2)}}>
                            <TextInput
                                style={{width: '100%', color: Colors.danube}}
                                value={x.price.toString()}
                                editable={false}
                                textAlign={'center'}
                            />
                        </View>
                    </View>
                )})
            }
            <View style={{marginHorizontal: RFPercentage(3), flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: RFValue(10)}}>
                <Text style={{color: Colors.funBlue}}>Total: {totalPrice} BDT</Text>
            </View>
            <View style={{marginHorizontal: RFPercentage(3), justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: RFValue(40)}}>
                <Text style={{color: Colors.catalinaBlue, fontWeight: 'bold', fontSize: RFValue(20)}}>Bills To</Text>
                <Text style={{color: Colors.catalinaBlue, marginTop: RFValue(10)}}>Customer Name: {billName}</Text>
                <Text style={{color: Colors.catalinaBlue, marginTop: RFValue(10)}}>Mobile Number: {billPhone}</Text>
                <Text style={{color: Colors.catalinaBlue, marginTop: RFValue(10)}}>Address: {billAddress}</Text>
            </View>
            <View style={{marginHorizontal: RFPercentage(3), justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: RFValue(40), marginBottom: RFValue(20)}}>
                <Text style={{color: Colors.catalinaBlue, fontWeight: 'bold', fontSize: RFValue(20)}}>Seller Information</Text>
                <Text style={{color: Colors.catalinaBlue, marginTop: RFValue(10)}}>Name: {sellerName}</Text>
                <Text style={{color: Colors.catalinaBlue, marginTop: RFValue(10)}}>Mobile Number: {sellerPhone}</Text>
            </View>
            </>
            :
            <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1, resizeMode: 'contain'}} source={Sorry}/>
        }
        <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: RFValue(15), right: RFValue(20), alignSelf: 'flex-end'}} onPress={()=> {
            props.navigation.getParam('navigation').goBack()
        }}/>
    </ScrollView>
}

OrderDetails.navigationOptions = () => {
    return {
        headerTitle: 'Order Details',
        headerRight: () => <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={Avatar}/>
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default OrderDetails