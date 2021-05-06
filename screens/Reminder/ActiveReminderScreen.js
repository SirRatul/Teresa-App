import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, RefreshControl, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Entypo, AntDesign, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import Avatar from '../../assets/icons/Avatar.png';
import Colors from '../../constants/Colors';
import moment from 'moment';
import CustomAlert from '../../components/CustomAlert';
import NoOrder from '../../assets/icons/NoOrder.jpg';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import {APP_BACKEND_URL} from "@env"

const ActiveReminderScreen = (props) => {
    Notifications.setNotificationHandler({
        handleNotification: async () => {
          return {
            shouldShowAlert: true,
            shouldPlaySound: true
          }
        }
    })
    Notifications.setNotificationCategoryAsync('welcome', [
        {
          identifier: 'one',
          buttonTitle: 'Yes',
          options: {
            isDestructive: false,
            isAuthenticationRequired: false
          }
        },
        {
          identifier: 'two',
          buttonTitle: 'No',
          options: {
            isDestructive: true,
            isAuthenticationRequired: false
          }
        }
        ]).then(() => {
            console.log(`Category 'welcome' created!`);
        }).catch(() => {
          console.log(`Category 'welcome' not created!`);
    });
    const timeFormat = (timeString) => {
        var time = timeString.split(":");
        var hour = time[0] % 12 || 12;
        var minute = time[1];
        var ampm = time[0] < 12 || time[0] === 24 ? "AM" : "PM";
        return hour + ":" + minute + " " + ampm;
    }
    const notificationTime = (timeString, notificationTime) => {
        var time = timeString.split(':')
        let hour, minute
        hour = time[0]
        minute = time[1]
        var day = new Date();
        day.setHours(hour)
        day.setMinutes(minute)
        day.setSeconds(0)
        day = moment(day).subtract(notificationTime, "minutes")
        return moment(day).format('HH:mm')
    }
    const [token, setToken] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [routineList, setRoutineList] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const getUserData = async() => {
        const userData = await AsyncStorage.getItem('userData')
        const tempUserData = JSON.parse(userData)
        setToken(tempUserData.token)
        setIsRefreshing(true)
        setIsLoading(true)
        try {
            const response = await axios.get(APP_BACKEND_URL+'routines/active/medicine', {
                headers: {
                    Authorization : `Bearer ${tempUserData.token}`
                }
            })
            setIsLoading(false)
            setRoutineList(response.data.message.activeRoutines)
            Notifications.cancelAllScheduledNotificationsAsync()
            /* Notifications.scheduleNotificationAsync({
                content: {
                    title: 'test notification',
                    data: {
                        routineId: 'entry._id'
                    },
                    categoryIdentifier: `welcome`
                },
                trigger: { 
                    hour: 1,
                    minute: 10,
                    repeats: true
                }
            }) */
            response.data.message.activeRoutines.forEach((entry) => {
                if(entry.notification){
                    entry.times.forEach((time) => {
                        timeString = notificationTime(time, entry.notificationBefore).split(':')
                        console.log(entry.unit+' unit '+entry.itemName+' at '+timeFormat(time)+' '+entry.meal+' meal')
                        Notifications.scheduleNotificationAsync({
                            content: {
                                title: entry.unit+' unit '+entry.itemName+' at '+timeFormat(time)+' '+entry.meal+' meal',
                                data: {
                                    routineId: entry._id
                                },
                                categoryIdentifier: `welcome`
                            },
                            trigger: { 
                                hour: parseInt(timeString[0], 10),
                                minute: parseInt(timeString[1], 10),
                                repeats: true
                            }
                        })
                    })
                }
            })
            AsyncStorage.setItem('activeRoutine', JSON.stringify({
                activeRoutine: response.data.message.activeRoutines.filter(routine => routine.notification == true)
            }))
        } catch (error) {
            setIsLoading(false)
            setErrorMessage(error.response.data.message)
            console.log(error.response.data.message)
        }
        setIsRefreshing(false)
    }
    const authAxios = axios.create({
        baseURL: APP_BACKEND_URL,
        headers: {
            Authorization : `Bearer ${token}`
        }
    })
    const reminderTimesFormatter = (reminderTimes) => {
        var time = reminderTimes.split(",");
        timeString = ''
        time.forEach((element) => {
            if(element.trim().length > 0){
                timeString = timeString + timeFormat(element.trim()) + ' '
            }
        });
        return timeString.trim()
    }
    useEffect(()=>{
        getUserData()
    }, [deleteRoutine, updateRoutine])
    useEffect(() => {
        Permissions.getAsync(Permissions.NOTIFICATIONS).then((statusObj) => {
          if(statusObj.status !== 'granted'){
            return Permissions.askAsync(Permissions.NOTIFICATIONS)
          }
          return statusObj
        }).then((statusObj) => {
          if(statusObj.status !== 'granted'){
            throw new Error('Permission not granted!')
          }
        }).catch((error) => {
          console.log(error)
          return null
        })
    }, [])
    useEffect(() => {
        const backgroundSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
          //outside app
          console.log('backgroundSubscription')
          if(response.actionIdentifier == 'one'){
            console.log('one button pressed')
            console.log(response.notification.request.identifier)
            updateRoutineStaus(response.notification.request.content.data.routineId, "On Time")
            Notifications.dismissNotificationAsync(response.notification.request.identifier).then((response) => {
              console.log('dismissNotificationAsync')
              console.log(response)
            }).catch((error) => {
              console.log(error)
            })
          } else if(response.actionIdentifier == 'two'){
            console.log('two button pressed')
            console.log(response.notification.request.identifier)
            updateRoutineStaus(response.notification.request.content.data.routineId, "Late")
            Notifications.dismissNotificationAsync(response.notification.request.identifier).then((response) => {
                console.log('dismissNotificationAsync')
                console.log(response)
              }).catch((error) => {
                console.log(error)
            })
          }
          // console.log(response)
        });
        const foregroundSubscription = Notifications.addNotificationReceivedListener((notification) => {
          //inside app
          console.log('foregroundSubscription')
          // console.log(notification);
        });
        return () => {
          backgroundSubscription.remove()
          foregroundSubscription.remove();
        }
    }, [])
    const deleteRoutine = async(routineId) => {
        setIsLoading(true)
        try {
            const response = await authAxios.delete(APP_BACKEND_URL+'routines/medicine/'+routineId)
            setIsLoading(false)
            setErrorMessage(response.data.message)
            getUserData()
        } catch (error) {
            setIsLoading(false)
            setErrorMessage(error.response.data.message)
        }
    }
    const updateRoutine = async(routineId, notificationValue) => {
        setIsLoading(true)
        try {
            const response = await authAxios.patch(APP_BACKEND_URL+'routines/medicine/'+routineId, {
                notification: !notificationValue
            })
            setIsLoading(false)
            setErrorMessage('Routine Updated Successfully')
            getUserData()
        } catch (error) {
            setIsLoading(false)
            setErrorMessage(error.response.data.message)
        }
    }
    const updateRoutineStaus = async(routineId, status) => {
        setIsLoading(true)
        try {
            const response = await authAxios.patch(APP_BACKEND_URL+'routines/medicine/'+routineId, {
                lastTaken: status
            })
            setIsLoading(false)
            setErrorMessage('Routine Updated Successfully')
            getUserData()
        } catch (error) {
            setIsLoading(false)
            setErrorMessage(error.response.data.message)
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
            <View style={{flex: 1, marginHorizontal: RFPercentage(3), marginTop: RFPercentage(3)}}>
                <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: RFPercentage(3), color: Colors.dateKimberly}}>{moment(new Date()).format('dddd')}</Text>
                    <Text style={{fontSize: RFPercentage(3), color: Colors.dateDanube}}>{moment(new Date()).format('D MMM, YYYY')}</Text>
                </View>
                <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: 0, right: 0, alignSelf: 'flex-end'}} onPress={() => {
                    props.navigation.navigate('Home')
                }}/>
            </View>
            {
                routineList.length > 0 ?
                <>
                <FlatList data={routineList} keyExtractor={(item) => item._id} renderItem={(itemData) => {
                    return <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(3), borderWidth: 1, borderRadius: 10, borderColor: Colors.silver}}>
                        <View style={{width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.linkWater, padding: 15,}}>
                            <MaterialCommunityIcons name="pill" size={40} color={Colors.pillColor} />
                        </View>
                        <View style={{width: '80%', padding: 20}}>
                            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={{fontSize: RFValue(17), color: Colors.violentViolet, fontWeight: 'bold'}}>{itemData.item.itemName}</Text>
                                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                    {
                                        itemData.item.notification ?
                                        <TouchableOpacity onPress={() => {
                                            updateRoutine(itemData.item._id, itemData.item.notification)
                                        }}>
                                            <MaterialCommunityIcons name="toggle-switch" size={36} color={Colors.japaneseLaurel} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => {
                                            updateRoutine(itemData.item._id, itemData.item.notification)
                                        }}>
                                            <MaterialCommunityIcons name="toggle-switch-off" size={36} color={Colors.grayChateau} />
                                        </TouchableOpacity>
                                    }
                                    <Ionicons name="pencil" size={26} color={Colors.pillColor} onPress={() => {
                                        props.navigation.navigate('UpdateReminder', {
                                            routineId:  itemData.item._id,
                                            itemName: itemData.item.itemName,
                                            itemName: itemData.item.itemName,
                                            unit: itemData.item.unit,
                                            startDate: itemData.item.startDate,
                                            continuity: itemData.item.continuity,
                                            endDate: itemData.item.endDate,
                                            meal: itemData.item.meal,
                                            timesPerDay: itemData.item.timesPerDay,
                                            times: itemData.item.times,
                                            notification: itemData.item.notification,
                                            notificationBefore: itemData.item.notificationBefore,
                                            navigation: props.navigation
                                        })
                                    }}/>
                                    <TouchableOpacity onPress={() => {
                                        deleteRoutine(itemData.item._id)
                                    }}>
                                        <MaterialIcons name="delete" size={26} color={Colors.pillColor} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{borderWidth: 1, alignSelf: 'flex-start', padding: 2, borderRadius: 5, borderColor: Colors.silver}}>
                                <Text style={{fontSize: RFValue(10),color: Colors.butterflyBush}}>Next pill time at {timeFormat(itemData.item.nextPillTime)}</Text>
                            </View>
                            <Text style={{color: Colors.logan}}>{itemData.item.unit} pill {itemData.item.meal} meal</Text>
                            {/* <Text style={{color: Colors.logan}}>3 pills left</Text> */}
                            <Text style={{color: Colors.logan}}>{moment(itemData.item.startDate).format('D MMMM')} - {moment(itemData.item.endDate).format('D MMMM')}</Text>
                            <Text style={{color: Colors.logan}}>{reminderTimesFormatter(itemData.item.reminderTimes)}</Text>
                            {
                                itemData.item.lastTaken == 'On Time' &&
                                <View style={{borderRadius: 5, alignSelf: 'flex-start', marginTop: 5, backgroundColor: Colors.japaneseLaurel, paddingVertical: 3, paddingHorizontal: 10}}>
                                    <Text style={{color: 'white'}}>On Time</Text>
                                </View>
                            }
                            {
                                itemData.item.lastTaken == 'Late' &&
                                <View style={{borderRadius: 5, alignSelf: 'flex-start', marginTop: 5, backgroundColor: 'red', paddingVertical: 3, paddingHorizontal: 10}}>
                                    <Text style={{color: 'white'}}>Late</Text>
                                </View>
                            }
                        </View>
                    </View>
                }}/>
                <View style={{width: '100%', marginTop: RFPercentage(3)}}/>
                </>
                :
                <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1, resizeMode: 'contain'}} source={NoOrder}/>
            }
            {/* <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), borderWidth: 1, borderRadius: 10, borderColor: Colors.silver}}>
                <View style={{width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.linkWater, padding: 15,}}>
                    <MaterialCommunityIcons name="pill" size={40} color={Colors.pillColor} />
                </View>
                <View style={{width: '80%', padding: 20}}>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{fontSize: RFValue(17), color: Colors.violentViolet, fontWeight: 'bold'}}>Pantonix 20 mg</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                            <MaterialCommunityIcons name="toggle-switch-off" size={36} color={Colors.grayChateau} />
                            <Ionicons name="pencil" size={26} color={Colors.pillColor} onPress={() => {
                                props.navigation.navigate('UpdateReminder')
                            }}/>
                            <MaterialIcons name="delete" size={26} color={Colors.pillColor} />
                        </View>
                    </View>
                    <View style={{borderWidth: 1, alignSelf: 'flex-start', padding: 2, borderRadius: 5, borderColor: Colors.silver}}>
                        <Text style={{fontSize: RFValue(10),color: Colors.butterflyBush}}>Next pill time at 9:00 PM</Text>
                    </View>
                    <Text style={{color: Colors.logan}}>1 pill before meal</Text>
                    <Text style={{color: Colors.logan}}>3 pills left</Text>
                    <Text style={{color: Colors.logan}}>7 September - 13 September</Text>
                    <Text style={{color: Colors.logan}}>8:00 AM, 2:00 PM, 9:00 PM</Text>
                    <View style={{borderRadius: 5, alignSelf: 'flex-start', marginTop: 5, backgroundColor: Colors.japaneseLaurel, paddingVertical: 3, paddingHorizontal: 10}}>
                        <Text style={{color: 'white'}}>On Time</Text>
                    </View>
                </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: RFPercentage(3), borderWidth: 1, borderRadius: 10, borderColor: Colors.silver}}>
                <View style={{width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.linkWater, padding: 15,}}>
                    <MaterialCommunityIcons name="pill" size={40} color={Colors.pillColor} />
                </View>
                <View style={{width: '80%', padding: 20}}>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{fontSize: RFValue(17), color: Colors.violentViolet, fontWeight: 'bold'}}>Pantonix 20 mg</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                            <MaterialCommunityIcons name="toggle-switch" size={36} color={Colors.japaneseLaurel} />
                            <Ionicons name="pencil" size={26} color={Colors.pillColor} onPress={() => {
                                props.navigation.navigate('UpdateReminder')
                            }}/>
                            <MaterialIcons name="delete" size={26} color={Colors.pillColor} />
                        </View>
                    </View>
                    <View style={{borderWidth: 1, alignSelf: 'flex-start', padding: 2, borderRadius: 5, borderColor: Colors.silver}}>
                        <Text style={{fontSize: RFValue(10),color: Colors.butterflyBush}}>Next pill time at 9:00 PM</Text>
                    </View>
                    <Text style={{color: Colors.logan}}>1 pill before meal</Text>
                    <Text style={{color: Colors.logan}}>3 pills left</Text>
                    <Text style={{color: Colors.logan}}>7 September - 13 September</Text>
                    <Text style={{color: Colors.logan}}>8:00 AM, 2:00 PM, 9:00 PM</Text>
                    <View style={{borderRadius: 5, alignSelf: 'flex-start', marginTop: 5, backgroundColor: Colors.japaneseLaurel, paddingVertical: 3, paddingHorizontal: 10}}>
                        <Text style={{color: 'white'}}>On Time</Text>
                    </View>
                </View>
            </View> */}
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

ActiveReminderScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Active Routines',
        headerRight: () => <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={Avatar}/>
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default ActiveReminderScreen