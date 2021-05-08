import React, {useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Avatar from '../../assets/icons/Avatar.png';
import Colors from '../../constants/Colors';
import { Entypo } from '@expo/vector-icons';

const AboutTeresaScreen = (props) => {
    const getUserData = async() => {
        const userData = await AsyncStorage.getItem('userData')
        const tempUserData = JSON.parse(userData)
        props.navigation.setParams({
            name: tempUserData.firstName+' '+tempUserData.lastName
        })
    }
    useEffect(() => {
        getUserData()
    }, [])
    return <View style={styles.screen}>
        <ScrollView style={styles.screen, {marginHorizontal: RFPercentage(5)}}>
            <Text style={{fontSize: RFPercentage(3), color: Colors.deepSapphire, fontWeight: 'bold', alignSelf: 'center', marginVertical: RFPercentage(2)}}>Why Teresa-</Text>
            <Text style={{color: Colors.deepSapphire}}>1. Teresa will give you reminders time to time as per prescription so that you never miss any medicine and never take wrong medicine or wrong dose.</Text>
            <Text style={{color: Colors.deepSapphire, marginBottom: RFPercentage(2)}}>Set reminder is easy, you own can do this or your guardian/child can do this for you.</Text>
            <Text style={{color: Colors.deepSapphire}}>2. Teresa will keep all your records safe and easy to find for further reference</Text>
            <Text style={{color: Colors.deepSapphire}}>(We often lose our prescriptions for not saving it anywhere, or don't find where we saved when we need it for further reference. Now you can save all your health records organised in one place and it's just an one click away to find it instantly. Our previous record is important for accurate diagnosis and money saving not to repeat the same diagnosis for losing record)</Text>
            <Text style={{color: Colors.deepSapphire, marginBottom: RFPercentage(2)}}>Upload prescription</Text>
            <Text style={{color: Colors.deepSapphire, marginBottom: RFPercentage(2)}}>3. Teresa will give you the easiest medicine order. Often we miss taking medicine for not refilling at the right time before stock ends. Teresa will help you to get medicine at home. Order medicine is the easiest.</Text>
            <Text style={{color: Colors.deepSapphire}}>Click Upload prescription&gt;Upload your prescription&gt;Mention the serial number of medicine as per your uploaded prescription&gt;select unit or day (the quantity you want put it in unit/ the total days for which you want to buy medicine)&gt;place order.</Text>
        </ScrollView>
        <TouchableOpacity style={{position: 'absolute', bottom: RFValue(5), right: RFValue(15), alignSelf: 'flex-end'}} onPress={() => {
            props.navigation.navigate('SetReminder')
        }}>
            <Entypo name="circle-with-plus" size={48} color={Colors.funBlue} />
        </TouchableOpacity>
    </View>
}

AboutTeresaScreen.navigationOptions = (navData) => {
    return {
        headerTitle: navData.navigation.getParam('name'),
        headerLeft: () => <Image style={{width: 32, height: 32, marginLeft: 10, resizeMode: 'contain'}} source={Avatar}/>
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default AboutTeresaScreen