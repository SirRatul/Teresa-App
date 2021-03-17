import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Colors from '../constants/Colors';

const PhotoPickModal = (props) => {
  return <Modal backdropColor="transparent" animationType="slide" transparent={true} visible={true} onRequestClose={props.onClear}>
    <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
      <View style={{width: '100%', borderWidth: 10, borderTopLeftRadius: 25, borderTopRightRadius: 25, borderColor: 'white', backgroundColor: 'white', padding: 15, alignItems: "center", shadowColor: "#000", shadowOffset: {
          width: 0,
          height: 2
        }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
        <View style={{width: '10%', borderBottomColor: 'black',borderBottomWidth: 3,}}/>
        <Text style={{width: '100%', marginTop: 15, textAlign: "center", color: 'black', fontSize: RFValue(30)}}>Upload Photo</Text>
        <Text style={{width: '100%', textAlign: "center", color: 'black', fontSize: RFValue(13)}}>Choose Your Prescription</Text>
        {/* <TouchableOpacity style={{width: '100%'}} onPress={props.chooseImage}>
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(3), backgroundColor: Colors.funBlue, padding: 6}}>
                <Text style={{fontSize: RFValue(15), color: 'white'}}>Choose From My Prescription</Text>
            </View>
        </TouchableOpacity> */}
        <TouchableOpacity style={{width: '100%'}} onPress={props.takeImage}>
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(3), backgroundColor: Colors.funBlue, padding: 6}}>
                <Text style={{fontSize: RFValue(15), color: 'white'}}>Upload Prescription</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={{width: '100%'}}  onPress={props.onClear}>
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(3), backgroundColor: Colors.funBlue, padding: 6}}>
                <Text style={{fontSize: RFValue(15), color: 'white'}}>Cancel</Text>
            </View>
        </TouchableOpacity>
        <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: RFValue(10), right: RFValue(10), alignSelf: 'flex-end'}} onPress={props.onClear}/>
      </View>
    </View>
  </Modal>
}
 
export default PhotoPickModal