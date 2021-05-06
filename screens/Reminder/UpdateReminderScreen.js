import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableWithoutFeedback, TextInput, TouchableOpacity, ActionSheetIOS } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import Avatar from '../../assets/icons/Avatar.png';
import Colors from '../../constants/Colors';
import { MaterialCommunityIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import CustomAlert from '../../components/CustomAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import {APP_BACKEND_URL} from "@env"

const UpdateReminderScreen = (props) => {
    const timeFormat = (timeString) => {
        if(!timeString){
            return new Date()
        }
        var time = timeString.split(':')
        let hour, minute
        hour = time[0]
        minute = time[1]
        var day = new Date();
        day.setHours(hour)
        day.setMinutes(minute)
        day.setSeconds(0)
        return day;
    }
    const [token, setToken] = useState('')
    const [startDate, setStartDate] = useState(moment(new Date(props.navigation.state.params.startDate)))
    const [startDatePickerShow, setStartDatePickerShow] = useState(false)
    const [continuity, setContinuity] = useState(props.navigation.state.params.continuity.toString())
    const [endDate, setEndDate] = useState(moment(new Date(props.navigation.state.params.endDate)))
    const [endDatePickerShow, setEndDatePickerShow] = useState(false)
    const [mealState, setMealState] = useState(props.navigation.state.params.meal)
    const [timesPerDay, setTimesPerDay] = useState(props.navigation.state.params.timesPerDay.toString())
    const [timesPerDayError, setTimesPerDayError] = useState(null)
    const [timeList, setTimeList] = useState([
        {
          time: timeFormat(props.navigation.state.params.times[0]) || new Date()
        },
        {
          time: timeFormat(props.navigation.state.params.times[1]) || new Date()
        },
        {
          time: timeFormat(props.navigation.state.params.times[2]) || new Date()
        },
        {
          time: timeFormat(props.navigation.state.params.times[3]) || new Date()
        },
        {
          time: timeFormat(props.navigation.state.params.times[4]) || new Date()
        }
    ])
    const [timePicker1Show, setTimePicker1Show] = useState(false)
    const [timePicker2Show, setTimePicker2Show] = useState(false)
    const [timePicker3Show, setTimePicker3Show] = useState(false)
    const [timePicker4Show, setTimePicker4Show] = useState(false)
    const [timePicker5Show, setTimePicker5Show] = useState(false)
    const [notificationState, setNotificationState] = useState(props.navigation.state.params.notification ? "On" : "Off")
    const [notificationTimeState, setNotificationTimeState] = useState(props.navigation.state.params.notificationBefore)
    const [errorMessage, setErrorMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const startDateChange = (event, selectedValue) => {
        setStartDatePickerShow(Platform.OS === 'ios')
        const selectedDate = selectedValue || startDate
        setStartDate(selectedDate)
        if(continuity){
            setEndDate(moment(selectedDate).add(continuity-1, 'days'))
        } else {
            setEndDate(selectedDate)
        }
    }
    const showStartDatepicker = () => {
        setStartDatePickerShow(true)
    }
    const endDateChange = (event, selectedValue) => {
        setEndDatePickerShow(Platform.OS === 'ios')
        const selectedDate = selectedValue || endDate
        setEndDate(selectedDate)
    }
    const showEndDatepicker = () => {
        setEndDatePickerShow(true)
    }
    const time1Change = (event, selectedValue) => {
        let newArr = [...timeList]; 
        setTimePicker1Show(Platform.OS === 'ios')
        const selectedTime = selectedValue || time
        newArr[0].time = selectedTime;
        setTimeList(newArr);
    }
    const time2Change = (event, selectedValue) => {
        let newArr = [...timeList]; 
        setTimePicker2Show(Platform.OS === 'ios')
        const selectedTime = selectedValue || time
        newArr[1].time = selectedTime;
        setTimeList(newArr);
    }
    const time3Change = (event, selectedValue) => {
        let newArr = [...timeList]; 
        setTimePicker3Show(Platform.OS === 'ios')
        const selectedTime = selectedValue || time
        newArr[2].time = selectedTime;
        setTimeList(newArr);
    }
    const time4Change = (event, selectedValue) => {
        let newArr = [...timeList]; 
        setTimePicker4Show(Platform.OS === 'ios')
        const selectedTime = selectedValue || time
        newArr[3].time = selectedTime;
        setTimeList(newArr);
    }
    const time5Change = (event, selectedValue) => {
        let newArr = [...timeList]; 
        setTimePicker5Show(Platform.OS === 'ios')
        const selectedTime = selectedValue || time
        newArr[4].time = selectedTime;
        setTimeList(newArr);
    }
    const showTimepicker = (index) => {
        if(index === 0){
            setTimePicker1Show(true)
        } else if(index === 1){
            setTimePicker2Show(true)
        } else if(index === 2){
            setTimePicker3Show(true)
        } else if(index === 3){
            setTimePicker4Show(true)
        } else if(index === 4){
            setTimePicker5Show(true)
        }
    }
    const getUserData = async() => {
        const userData = await AsyncStorage.getItem('userData')
        const tempUserData = JSON.parse(userData)
        setToken(tempUserData.token)
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
    const submitHandler = async() => {
        let times = timeList.slice(0, timesPerDay)
        for(var i = 0; i < times.length; i++){
            times[i] = moment(times[i].time).format('HH:mm')
        }
        setIsLoading(true)
        try {
            const response = await authAxios.patch(APP_BACKEND_URL+'routines/medicine/'+props.navigation.state.params.routineId, {
                startDate: moment(startDate).format('YYYY-MM-DD'),
                endDate: moment(endDate).format('YYYY-MM-DD'),
                continuity,
                meal: mealState,
                timesPerDay,
                times,
                notification: notificationState == 'On' ? true : false,
                notificationBefore: notificationTimeState
            })
            setIsLoading(false)
            setErrorMessage('Routine Updated Successfully')
        } catch (error) {
            setIsLoading(false)
            setErrorMessage(error.response.data.message)
        }
    }
    const modalHandler = () => {
        setErrorMessage(null)
        props.navigation.navigate('ActiveReminder')
    }
    return <View style={styles.screen}>
        <ScrollView style={styles.screen}>
            {errorMessage &&<CustomAlert message={errorMessage} onClear={modalHandler}/>}
            <View style={{backgroundColor: Colors.linkWater, justifyContent: 'center', alignItems: 'center'}}>
                <MaterialCommunityIcons style={{marginTop: RFPercentage(3)}} name="pill" size={40} color={Colors.pillColor} />
                <Text style={{fontSize: RFValue(30), marginBottom: RFPercentage(3), color: Colors.mariner}}>{props.navigation.state.params.itemName}</Text>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginVertical: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 2, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Start Date</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.blackSqueeze, flexDirection: 'row'}}>
                    <TouchableWithoutFeedback onPress={showStartDatepicker}>
                        <View style={{width: '100%', marginLeft: 5, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{paddingHorizontal: 8}}>{moment(startDate).format('DD/MM/YYYY')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <FontAwesome name="calendar" style={{alignItems: 'flex-end', marginLeft: -RFValue(25)}} size={18} color={Colors.danube} onPress={showStartDatepicker} />
                </View>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 2, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Continuity</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.blackSqueeze}}>
                    <TextInput style={{width: '100%', paddingHorizontal: 8}} textAlign={'center'} value={continuity} onChangeText={(text) => {
                        setContinuity(text.replace(/[^0-9]/g, ''))
                        setEndDate(moment(startDate).add(parseInt(text.replace(/[^0-9]/g, ''))-1, 'days'))
                    }} keyboardType='numeric'/>
                    <View style={{alignSelf: 'flex-end', marginTop: -RFValue(30)}}>
                        <AntDesign name="caretup" size={12} color={Colors.danube} onPress={() => {
                            console.log('increase continuity')
                        }}/>
                        <AntDesign name="caretdown" size={12} color={Colors.danube} onPress={() => {
                            console.log('decrease continuity')
                        }}/>
                    </View>
                </View>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 2, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>End Date</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.blackSqueeze, flexDirection: 'row'}}>
                    <View style={{width: '100%', marginLeft: 5, justifyContent: 'center', alignItems: 'center'}}>
                    {/* <TouchableWithoutFeedback onPress={showEndDatepicker}> */}
                        <Text style={{paddingHorizontal: 8}}>{moment(endDate).format('DD/MM/YYYY')}</Text>
                    {/* </TouchableWithoutFeedback> */}
                    </View>
                    {/* <FontAwesome name="calendar" style={{alignItems: 'flex-end', marginLeft: -RFValue(25)}} size={18} color={Colors.danube} onPress={showEndDatepicker} /> */}
                </View>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 2, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Meal</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.blackSqueeze}}>
                {Platform.OS == 'android' ?
                        <>
                        <Picker
                        selectedValue={mealState}
                        style={{width: '100%', height: 30, backgroundColor: 'transparent'}}
                        onValueChange={(itemValue, itemIndex) => setMealState(itemValue)}
                        >
                            <Picker.Item color={Colors.danube} label="Before Meal" value="Before" />
                            <Picker.Item color={Colors.danube} label="After Meal" value="After" />
                        </Picker>
                        <AntDesign name="caretdown" style={{position: "absolute", right: RFValue(6)}} size={12} color={Colors.danube}/>
                        </>
                        :
                        <TouchableOpacity onPress={() => {
                            ActionSheetIOS.showActionSheetWithOptions(
                                {
                                  options: ["Before Meal", "After Meal", "Cancel"],
                                  destructiveButtonIndex: 2,
                                  userInterfaceStyle: 'dark'
                                },
                                (buttonIndex) => {
                                  if (buttonIndex === 0) {
                                    setMealState('Before')
                                  } else if (buttonIndex === 1) {
                                    setMealState('After')
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
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 2, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Times Per Day</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.blackSqueeze}}>
                    <TextInput style={{width: '100%', paddingHorizontal: 8}} textAlign={'center'} value={timesPerDay} onChangeText={(text) => { 
                        if(text <= 5){
                            setTimesPerDay(text.replace(/[^0-9]/g, ''))
                            setTimesPerDayError(null)
                        } else {
                            setTimesPerDayError('Times per day value must be 1 to 5')
                        }
                    }} keyboardType='numeric' maxLength={1}/>
                    <View style={{alignSelf: 'flex-end', marginTop: -RFValue(30)}}>
                        <AntDesign name="caretup" size={12} color={Colors.danube} onPress={() => {
                            if(timesPerDay != 5){
                                setTimesPerDay((parseInt(timesPerDay) + 1).toString())
                            }
                        }}/>
                        <AntDesign name="caretdown" size={12} color={Colors.danube} onPress={() => {
                            if(timesPerDay > 0){
                                setTimesPerDay((parseInt(timesPerDay) - 1).toString())
                            }
                        }}/>
                    </View>
                </View>
            </View>
            {timesPerDayError &&
                <View style={{alignSelf: 'flex-start', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3)}}>
                    <Text style={{fontSize: RFValue(16), color: 'red'}}>{timesPerDayError}</Text>
                </View>
            }
            {
                Array.from({ length: timesPerDay }, (v, k) => (
                    <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}} key={k}>
                        <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 2, borderColor: Colors.funBlue}}>
                            <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Time {(k+1)}</Text>
                        </View>
                        <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.blackSqueeze, flexDirection: 'row'}}>
                            <View style={{width: '100%', marginLeft: 5, justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableWithoutFeedback onPress={() => {
                                    showTimepicker(k)
                                }}>
                                    <Text style={{paddingHorizontal: 8}}>{moment(timeList[k].time).format('hh:mm A')}</Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <MaterialCommunityIcons name="clock" style={{alignItems: 'flex-end', marginLeft: -RFValue(25)}} size={18} color={Colors.danube} onPress={() => {
                                showTimepicker(k)
                            }} />
                        </View>
                    </View>
                ))
            }
            <View style={{flexDirection: 'row', marginHorizontal: RFPercentage(3), marginBottom: RFPercentage(3), paddingVertical: 5}}>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 2, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Notification</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.blackSqueeze}}>
                    {Platform.OS == 'android' ?
                        <>
                        <Picker
                            selectedValue={notificationState}
                            style={{width: '100%', height: 30, backgroundColor: 'transparent'}}
                            onValueChange={(itemValue, itemIndex) => setNotificationState(itemValue)}
                        >
                            <Picker.Item color={Colors.danube} label="On" value="On" />
                            <Picker.Item color={Colors.danube} label="Off" value="Off" />
                        </Picker>
                        <AntDesign name="caretdown" style={{position: "absolute", right: RFValue(6)}} size={12} color={Colors.danube}/>
                        </>
                        :
                        <TouchableOpacity onPress={() => {
                            ActionSheetIOS.showActionSheetWithOptions(
                                {
                                  options: ["On", "Off", "Cancel"],
                                  destructiveButtonIndex: 2,
                                  userInterfaceStyle: 'dark'
                                },
                                (buttonIndex) => {
                                  if (buttonIndex === 0) {
                                    setNotificationState('On')
                                  } else if (buttonIndex === 1) {
                                    setNotificationState('Off')
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
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: Colors.periwinkleGray, borderWidth: 2, borderColor: Colors.funBlue}}>
                    <Text style={{color: Colors.resolutionBlue, marginLeft: 5, marginVertical: 5, paddingLeft: 12}}>Set Notification</Text>
                </View>
                <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.blackSqueeze}}>
                    <AntDesign name="caretdown" style={{position: "absolute", right: RFValue(6)}} size={12} color={Colors.danube}/>
                    {Platform.OS == 'android' ?
                        <>
                        <Picker
                            selectedValue={notificationTimeState}
                            style={{width: '100%', height: 30, backgroundColor: 'transparent'}}
                            onValueChange={(itemValue, itemIndex) => setNotificationTimeState(itemValue)}
                        >
                            <Picker.Item color={Colors.danube} label="Before 15 mins" value="15" />
                            <Picker.Item color={Colors.danube} label="Before 30 mins" value="30" />
                            <Picker.Item color={Colors.danube} label="Before 1 hour" value="60" />
                        </Picker>
                        <AntDesign name="caretdown" style={{position: "absolute", right: RFValue(6)}} size={12} color={Colors.danube}/>
                        </>
                        :
                        <TouchableOpacity onPress={() => {
                            ActionSheetIOS.showActionSheetWithOptions(
                                {
                                  options: ["Before 15 mins", "Before 30 mins", "Before 1 hour", "Cancel"],
                                  destructiveButtonIndex: 3,
                                  userInterfaceStyle: 'dark'
                                },
                                (buttonIndex) => {
                                  if (buttonIndex === 0) {
                                    setNotificationTimeState('15')
                                  } else if (buttonIndex === 1) {
                                    setNotificationTimeState('30')
                                  } else if (buttonIndex === 2) {
                                    setNotificationTimeState('60')
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
            <TouchableOpacity onPress={submitHandler}>
                <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(3), marginBottom: RFPercentage(6), backgroundColor: Colors.funBlue, padding: 6}}>
                    <Text style={{fontSize: RFValue(16), color: 'white'}}>Update</Text>
                </View>
            </TouchableOpacity>
            {startDatePickerShow && <DateTimePicker
                value={startDate}
                mode={'date'}
                display='default'
                onChange={startDateChange}
            />
            }
            {endDatePickerShow && <DateTimePicker
                value={endDate}
                mode={'date'}
                display='default'
                onChange={endDateChange}
            />
            }
            {timePicker1Show && <DateTimePicker
                value={timeList[0].time}
                mode={'time'}
                display='default'
                onChange={time1Change}
            />
            }
            {timePicker2Show && <DateTimePicker
                value={timeList[1].time}
                mode={'time'}
                display='default'
                onChange={time2Change}
            />
            }
            {timePicker3Show && <DateTimePicker
                value={timeList[2].time}
                mode={'time'}
                display='default'
                onChange={time3Change}
            />
            }
            {timePicker4Show && <DateTimePicker
                value={timeList[3].time}
                mode={'time'}
                display='default'
                onChange={time4Change}
            />
            }
            {timePicker5Show && <DateTimePicker
                value={timeList[4].time}
                mode={'time'}
                display='default'
                onChange={time5Change}
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

UpdateReminderScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Edit Routine',
        headerRight: () => <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={Avatar}/>
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default UpdateReminderScreen