import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Entypo, AntDesign, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Avatar from '../../assets/icons/Avatar.png';
import Colors from '../../constants/Colors';
import moment from 'moment';

const ActiveReminderScreen = (props) => {
    return <View style={styles.screen}>
        <ScrollView style={styles.screen}>
            <View style={{flex: 1, margin: RFPercentage(3)}}>
                <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: RFPercentage(3), color: Colors.dateKimberly}}>{moment(new Date()).format('dddd')}</Text>
                    <Text style={{fontSize: RFPercentage(3), color: Colors.dateDanube}}>{moment(new Date()).format('D MMM, YYYY')}</Text>
                </View>
                <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: 0, right: 0, alignSelf: 'flex-end'}} onPress={() => {
                    props.navigation.navigate('Home')
                }}/>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), borderWidth: 1, borderRadius: 10, borderColor: Colors.silver}}>
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
            </View>
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