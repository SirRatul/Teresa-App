import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Colors from '../constants/Colors';

const CustomAlert = (props) => {
  return <Modal animationType="slide" transparent={true} visible={true} onRequestClose={props.onClear}>
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <View style={{width: '80%', backgroundColor: "white", padding: 15, alignItems: "center", shadowColor: "#000", shadowOffset: {
          width: 0,
          height: 2
        }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
        <Feather name="alert-circle" size={64} color={Colors.funBlue} />
        <Text style={{width: '100%', marginVertical: 15, textAlign: "center", color: Colors.deepSapphire}}>{props.message}</Text>
        <TouchableOpacity style={{width: '100%'}} onPress={props.onClear}>
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(3), backgroundColor: Colors.funBlue, padding: 6}}>
                <Text style={{fontSize: RFValue(15), color: 'white'}}>Okay</Text>
            </View>
        </TouchableOpacity>
        <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: RFValue(10), right: RFValue(10), alignSelf: 'flex-end'}} onPress={props.onClear}/>
      </View>
    </View>
  </Modal>
}
 
export default CustomAlert