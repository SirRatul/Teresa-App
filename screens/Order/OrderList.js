import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, RefreshControl, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Colors from '../../constants/Colors';
import Avatar from '../../assets/icons/Avatar.png';
import NoOrder from '../../assets/icons/NoOrder.jpg';
import CustomAlert from '../../components/CustomAlert';
import {APP_BACKEND_URL} from "@env"

const OrderList = (props) => {
    const [token, setToken] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [orderList, setOrderList] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const getUserData = async() => {
        const userData = await AsyncStorage.getItem('userData')
        const tempUserData = JSON.parse(userData)
        setToken(tempUserData.token)
        setIsRefreshing(true)
        try {
            const response = await axios.get(APP_BACKEND_URL+'orders/prescription/me', {
                headers: {
                    Authorization : `Bearer ${tempUserData.token}`
                }
            })
            setOrderList(response.data.message)
        } catch (error) {
            setErrorMessage(error.response.data.message)
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
    const modalHandler = () => {
        setErrorMessage(null)
    }
    return <ScrollView style={[styles.screen, {backgroundColor: 'white'}]} refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={getUserData} />
    }>
        <View style={[styles.screen, {backgroundColor: 'white'}]}>
            {errorMessage &&<CustomAlert message={errorMessage} onClear={modalHandler}/>}
            {
                orderList.length > 0 ?
                <>
                <View style={{marginTop: RFValue(40)}}/>
                <FlatList data={orderList} keyExtractor={(item) => item.orderNo.toString()} renderItem={(itemData) => {
                    return <TouchableOpacity onPress={() => {
                        props.navigation.navigate('OrderDetails', { 
                            orderNo: itemData.item.orderNo,
                            invoiceStatus: itemData.item.invoiceStatus,
                            navigation: props.navigation
                        })
                    }}>
                    <View style={[styles.card]}>
                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: '50%', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                <Text style={styles.orderNumberText}>Order No: {itemData.item.orderNo}</Text>
                                <Text style={styles.orderPriceText}>{itemData.item.invoiceStatus == 'Created' ? 'Processing': 'Pending'}</Text>
                            </View>
                            <View style={{width: '50%', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={styles.orderTimeText}>{itemData.item.dateTime}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                }}/>
                </>
                :
                <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1, resizeMode: 'contain'}} source={NoOrder}/>
            }
            <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: RFValue(10), right: RFPercentage(3), alignSelf: 'flex-end'}} onPress={() => {
                props.navigation.navigate('Menu')
            }}/>
        </View>
    </ScrollView>
}

OrderList.navigationOptions = () => {
    return {
        headerTitle: 'Order List',
        headerRight: () => <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={Avatar}/>
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    card: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: RFValue(30), 
        borderWidth: 1, 
        borderColor: Colors.alto, 
        backgroundColor: Colors.alabaster, 
        padding: 15,
    },
    orderNumberText: {
        color: Colors.catalinaBlue, 
        fontSize: RFValue(20),
    },
    orderPriceText: {
        color: Colors.yukonGold, 
        fontSize: RFValue(15),
        marginTop: RFValue(10)
    },
    orderTimeText: {
        color: 'black', 
        fontSize: RFValue(15)
    }
})

export default OrderList