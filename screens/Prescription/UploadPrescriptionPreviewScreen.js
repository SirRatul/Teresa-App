import React from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, Image, TextInput } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Colors from '../../constants/Colors';
import Avatar from '../../assets/icons/Avatar.png';

const UploadPrescriptionPreviewScreen = (props) => {
    return <Modal animationType="slide" transparent={true} visible={true} onRequestClose={props.onClear}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{backgroundColor: Colors.funBlue, justifyContent: 'space-between', flexDirection: 'row', padding: 10, paddingVertical: 15, alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: RFValue(20)}}>Upload Prescription</Text>
                <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={Avatar}/>
            </View>
            <ScrollView style={styles.screen}>
                <View style={{marginVertical: RFPercentage(7), marginHorizontal: RFPercentage(3), justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{height: RFValue(256), width: RFValue(256), resizeMode: 'contain'}} source={{uri: props.pickedImage}}/>
                </View>
                <View style={{marginHorizontal: RFPercentage(3), flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: '30%'}}>
                        <Text>Med. Sl. No.</Text>
                        <Text style={{fontSize: RFValue(9)}}>(As Per Prescription)</Text>
                    </View>
                    <View style={{width: '30%'}}>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name="checkbox-outline" size={20} color="black" style={{marginRight: 3}} />
                            <Text>{props.unitSelected ? 'Unit' : 'Day'}</Text>
                        </View>
                    </View>
                </View>
                {props.inputList.map((x, i) => {
                    return (
                        <View style={{marginHorizontal: RFPercentage(3), marginTop: RFValue(10), flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} key={i}>
                            <View style={{width: '30%', backgroundColor: Colors.blackSqueeze, padding: 6, marginRight: RFPercentage(2),  marginLeft: RFPercentage(3)}}>
                                <TextInput
                                    style={{width: '100%', color: Colors.danube}}
                                    value={x.medicineSN}
                                    editable={false}
                                />
                            </View>
                            <View style={{width: '30%', backgroundColor: Colors.blackSqueeze, padding: 6, marginLeft: RFPercentage(2)}}>
                                <TextInput
                                    style={{width: '100%', color: Colors.danube}}
                                    value={props.unitSelected ? x.unit : x.day}
                                    editable={false}
                                />
                            </View>
                        </View>
                    )})
                }
                <View style={{marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2)}}>
                    <View style={{width: '100%'}}>
                        <Text>Additional Note</Text>
                        <TextInput
                            style={{width: '100%', color: Colors.danube, backgroundColor: Colors.blackSqueeze, padding: 6, marginTop: RFPercentage(1)}}
                            value={props.additionalNote}
                            multiline = {true}
                            numberOfLines = {4}
                            editable={false}
                        />
                    </View>
                </View>
                <View style={{marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2), marginBottom: RFPercentage(5)}}>
                    <View style={{width: '100%'}}>
                        <Text>Delivery Details</Text>
                        <TextInput
                            style={{width: '100%', color: Colors.danube, backgroundColor: Colors.blackSqueeze, padding: 6, marginTop: RFPercentage(1)}}
                            value={props.deliveryDetails}
                            multiline = {true}
                            numberOfLines = {4}
                            editable={false}
                        />
                    </View>
                </View>
                <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: RFValue(15), right: RFValue(20), alignSelf: 'flex-end'}} onPress={props.onClear}/>
            </ScrollView>
        </View>
    </Modal>
}
   
const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default UploadPrescriptionPreviewScreen