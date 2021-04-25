import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as Notifications from 'expo-notifications';
import Colors from '../../constants/Colors';
import Avatar from '../../assets/icons/Avatar.png';
import Profile from '../../assets/icons/metro-profile.png';
import LogOut from '../../assets/icons/metro-exit.png';
import UploadPrescription from '../../assets/icons/Icon-awesome-file-upload.png';
import SetReminder from '../../assets/icons/Icon-awesome-clock.png';
import MyReminder from '../../assets/icons/ALARM.png';
import MyPrescription from '../../assets/icons/MEDICAL.png';
import MyOrder from '../../assets/icons/order.png';

const MenuScreen = (props) => {
    const [name, setName] = useState(null)
    const getUserData = async() => {
        const userData = await AsyncStorage.getItem('userData')
        const tempUserData = JSON.parse(userData)
        setName(tempUserData.firstName+' '+tempUserData.lastName)
    }
    useEffect(()=>{
        getUserData()
    }, [])
    return <View style={styles.screen}>
        <ScrollView style={styles.screen}>
            <View style={{flex: 1, width: '100%', flexDirection: 'row', padding: 20, alignItems: 'center', backgroundColor: Colors.athensGray, marginVertical: RFPercentage(2)}}>
                <Image style={{width: 48, height: 48, marginRight: 10, resizeMode: 'contain'}} source={Avatar}/>
                <Text style={{fontSize: RFValue(18), color: Colors.catalinaBlue}}>{name}</Text>
                <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: 0, right: 5, alignSelf: 'flex-end'}} onPress={() => {
                    props.navigation.navigate('Home')
                }}/>
            </View>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('Home')
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2), borderWidth: 1, borderColor: Colors.alto, backgroundColor: Colors.blackSqueeze}}>
                    <View style={{width: '15%', justifyContent: 'center', alignItems: 'center'}}>
                        <FontAwesome name="home" size={32} color={Colors.catalinaBlue}/>
                    </View>
                    <View style={{width: '85%', justifyContent: 'center'}}>
                        <Text style={{color: Colors.chathamsBlue, fontSize: RFValue(15), fontWeight: 'bold'}}>Home</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('MyProfile')
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2), borderWidth: 1, borderColor: Colors.alto, backgroundColor: Colors.blackSqueeze}}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: '15%', justifyContent: 'center', alignItems: 'center'}}>
                            <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={Profile}/>
                        </View>
                        <View style={{width: '85%', justifyContent: 'center'}}>
                            <Text style={{color: Colors.chathamsBlue, fontSize: RFValue(15), fontWeight: 'bold'}}>My Profile</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('UploadPrescription')
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2), borderWidth: 1, borderColor: Colors.alto, backgroundColor: Colors.blackSqueeze}}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: '15%', justifyContent: 'center', alignItems: 'center'}}>
                            {/* <FontAwesome5 name="file-medical" size={28} color={Colors.catalinaBlue} /> */}
                            <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={UploadPrescription}/>
                        </View>
                        <View style={{width: '85%', justifyContent: 'center'}}>
                            <Text style={{color: Colors.chathamsBlue, fontSize: RFValue(15), fontWeight: 'bold'}}>Upload Prescription</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('SetReminder')
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2), borderWidth: 1, borderColor: Colors.alto, backgroundColor: Colors.blackSqueeze}}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: '15%', justifyContent: 'center', alignItems: 'center'}}>
                            {/* <MaterialCommunityIcons name="clock" size={28} color={Colors.catalinaBlue} /> */}
                            <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={SetReminder}/>
                        </View>
                        <View style={{width: '85%', justifyContent: 'center'}}>
                            <Text style={{color: Colors.chathamsBlue, fontSize: RFValue(15), fontWeight: 'bold'}}>Set Reminder</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('OrderList')
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2), borderWidth: 1, borderColor: Colors.alto, backgroundColor: Colors.blackSqueeze}}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: '15%', justifyContent: 'center', alignItems: 'center'}}>
                            <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={MyOrder}/>
                        </View>
                        <View style={{width: '85%', justifyContent: 'center'}}>
                            <Text style={{color: Colors.chathamsBlue, fontSize: RFValue(15), fontWeight: 'bold'}}>My Orders</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('Reminder')
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2), borderWidth: 1, borderColor: Colors.alto, backgroundColor: Colors.blackSqueeze}}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: '15%', justifyContent: 'center', alignItems: 'center'}}>
                            <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={MyReminder}/>
                        </View>
                        <View style={{width: '85%', justifyContent: 'center'}}>
                            <Text style={{color: Colors.chathamsBlue, fontSize: RFValue(15), fontWeight: 'bold'}}>My Reminders</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('Prescription')
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2), borderWidth: 1, borderColor: Colors.alto, backgroundColor: Colors.blackSqueeze}}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: '15%', justifyContent: 'center', alignItems: 'center'}}>
                            {/* <FontAwesome5 name="notes-medical" size={28} color={Colors.funBlue} /> */}
                            <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={MyPrescription}/>
                        </View>
                        <View style={{width: '85%', justifyContent: 'center'}}>
                            <Text style={{color: Colors.chathamsBlue, fontSize: RFValue(15), fontWeight: 'bold'}}>My Prescription</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                AsyncStorage.removeItem('userData')
                AsyncStorage.removeItem('activeRoutine')
                Notifications.cancelAllScheduledNotificationsAsync()
                props.navigation.navigate('Auth')
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: RFPercentage(3), marginVertical: RFPercentage(2), borderWidth: 1, borderColor: Colors.alto, backgroundColor: Colors.blackSqueeze}}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: '15%', justifyContent: 'center', alignItems: 'center'}}>
                            <Image style={{width: 32, height: 32, marginRight: 4, resizeMode: 'contain'}} source={LogOut}/>
                        </View>
                        <View style={{width: '85%', justifyContent: 'center'}}>
                            <Text style={{color: Colors.chathamsBlue, fontSize: RFValue(15), fontWeight: 'bold'}}>Log Out</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </ScrollView>
    </View>
}

MenuScreen.navigationOptions = () => {
    return {
        headerTitle: 'Menu'
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default MenuScreen