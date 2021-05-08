import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, TextInput, Image } from 'react-native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Colors from '../../constants/Colors';
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import PhotoPickModal from '../../components/PhotoPickModal';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Avatar from '../../assets/icons/Avatar.png';
import UploadPrescriptionPreviewScreen from './UploadPrescriptionPreviewScreen';
import CustomAlert from '../../components/CustomAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrescriptionPhotoChooseModal from '../../components/PrescriptionPhotoChooseModal';
import {APP_BACKEND_URL} from "@env"

const UploadPrescriptionScreen = (props) => {
    const [token, setToken] = useState('')
    const [unitSelected, setUnitSelected] = useState(true)
    const [daySelected, setDaySelected] = useState(false)
    const [photoPickModal, setPhotoPickModal] = useState(false)
    const [photoChooseModal, setPhotoChooseModal] = useState(false)
    const [additionalNote, setAdditionalNote] = useState('')
    const [deliveryDetails, setDeliveryDetails] = useState('')
    const [termsAndConditionAgree, setTermsAndConditionAgree] = useState(false)
    const [inputList, setInputList] = useState([{ medicineSN: '', unit: '', day: '' }])
    const [pickedImage, setPickedImage] = useState(null)
    const [previewButtonDisable, setPreviewButtonDisable] = useState(false)
    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)
    const [prescriptionImage, setPrescriptionImage] = useState(false)
    const [prescriptionId, setPrescriptionId] = useState(null)
    const [previewPopUp, setPreviewPopUp] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const verifyPermissions = async() => {
        const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        if(result.status !== 'granted'){
            setPhotoPickModal(false)
            setErrorMessage('You need to grant gallery permissions to use this app')
            return false
        }
        return true
    }
    const getUserData = async() => {
        const userData = await AsyncStorage.getItem('userData')
        const tempUserData = JSON.parse(userData)
        setToken(tempUserData.token)
    }
    useEffect(()=>{
        getUserData()
        if(props.navigation.getParam('imageUrl')){
            setPickedImage(props.navigation.getParam('imageUrl'))
        }
        if(props.navigation.getParam('imageUrl')){
            setPrescriptionId(props.navigation.getParam('prescriptionId'))
        }
    }, [])
    const authAxios = axios.create({
        baseURL: APP_BACKEND_URL,
        headers: {
            Authorization : `Bearer ${token}`
        }
    })
    useEffect(() => {
        previewButtonVisibiltyCheck()
    }, [pickedImage, inputList, unitSelected, daySelected, deliveryDetails, termsAndConditionAgree])

    const previewButtonVisibiltyCheck = () => {
        if(!pickedImage){
            setSubmitButtonDisable(true)
            return setPreviewButtonDisable(true)
        }
        if(!deliveryDetails){
            setSubmitButtonDisable(true)
            return setPreviewButtonDisable(true)
        }
        let disabled = false
        inputList.forEach((inputList) => {
            if(inputList.medicineSN === ''){
                disabled = true
                return
            }
            if(unitSelected && inputList.unit === ''){
                disabled = true
                return
            } 
            if(daySelected && inputList.day === ''){
                disabled = true
                return
            }
        })
        if(disabled){
            setSubmitButtonDisable(true)
            return setPreviewButtonDisable(true)
        } else {
            setPreviewButtonDisable(false)
            if(termsAndConditionAgree){
                return setSubmitButtonDisable(false)
            } else {
                return setSubmitButtonDisable(true)
            }
        }
    }
    const submitHandler = async() => {
        if(prescriptionId) {
            setIsLoading(true)
            try {
                const response = await authAxios.post('files/prescription/order', {
                    id: prescriptionId,
                    order: inputList,
                    deliveryDetails,
                    additionalNote
                });
                setIsLoading(false)
                setPickedImage(null)
                setAdditionalNote('')
                setDeliveryDetails('')
                setPrescriptionId(null)
                setInputList([{ medicineSN: '', unit: '', day: '' }])
                setErrorMessage('Prescription Ordered Succesfully')
            } catch (error) {
                setIsLoading(false)
                setErrorMessage(error.response.data.message)
            }
        } else {
            let fileType = pickedImage.substring(pickedImage.lastIndexOf(".") + 1);
            var formData = new FormData();
            if(prescriptionImage){
                formData.append("file", pickedImage);
            } else {
                formData.append("file", {
                    uri: pickedImage,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`
                });
            }
            formData.append("order", JSON.stringify(inputList));
            formData.append("additionalNote", additionalNote);
            formData.append("deliveryDetails", deliveryDetails);
            setIsLoading(true)
            try {
                const response = await authAxios.post('files/prescription', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setIsLoading(false)
                setPickedImage(null)
                setAdditionalNote('')
                setDeliveryDetails('')
                setInputList([{ medicineSN: '', unit: '', day: '' }])
                setErrorMessage('Prescription Uploaded Succesfully')
            } catch (error) {
                setIsLoading(false)
                setErrorMessage(error.response.data.message)
            }
        }
    }
    const takeImageHandler = async() => {
        const hasPermission = await verifyPermissions()
        if(!hasPermission){
            return
        }
        const image = await ImagePicker.launchImageLibraryAsync()
        setPhotoPickModal(false)
        setPickedImage(image.uri)
        setPrescriptionImage(false)
    }
    const chooseImageHandler = () => {
        setPhotoChooseModal(true)
    }
    const takeImageFromPrescriptionHandler = (imageUrl, prescriptionId) => {
        setPickedImage(imageUrl)
        setPrescriptionId(prescriptionId)
        setErrorMessage(null)
        setPreviewPopUp(false)
        setPhotoPickModal(false)
        setPhotoChooseModal(false)
        setPrescriptionImage(true)
    }
    const handleInputChange = (name, index, value) => {
        const list = [...inputList]
        list[index][name] = value
        setInputList(list)
    }
    const handleRemoveClick = (index) => {
        const list = [...inputList]
        list.splice(index, 1)
        setInputList(list)
    };
    const handleAddClick = () => {
        setInputList([...inputList, { medicineSN: '', unit: '', day: '' }])
    }
    const modalHandler = () => {
        setErrorMessage(null)
        setPreviewPopUp(false)
        setPhotoPickModal(false)
        setPhotoChooseModal(false)
        setPrescriptionId(null)
    }
    const previewModalHandler = () => {
        setErrorMessage(null)
        setPreviewPopUp(false)
        setPhotoPickModal(false)
        setPhotoChooseModal(false)
    }
    return <View style={styles.screen}>
        {previewPopUp &&<UploadPrescriptionPreviewScreen pickedImage={pickedImage} unitSelected={unitSelected} inputList={inputList} additionalNote={additionalNote} deliveryDetails={deliveryDetails} takeImage={takeImageHandler} onClear={previewModalHandler}/>}
        <ScrollView style={styles.screen}>
            {errorMessage &&<CustomAlert message={errorMessage} onClear={previewModalHandler}/>}
            {photoPickModal &&<PhotoPickModal onClear={modalHandler} takeImage={takeImageHandler} chooseImage={chooseImageHandler}/>}
            {photoChooseModal &&<PrescriptionPhotoChooseModal onClear={modalHandler} chooseImage={takeImageFromPrescriptionHandler}/>}
            <View style={{marginVertical: RFPercentage(7), marginHorizontal: RFPercentage(3), justifyContent: 'center', alignItems: 'center'}}>
                {!pickedImage ? 
                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                    setPhotoPickModal(true)
                }}>
                    <FontAwesome5 name="cloud-upload-alt" size={84} color={Colors.pillColor} />
                    <Text style={{fontWeight: 'bold', fontSize: RFValue(18), color: Colors.astronaut}}>Upload Prescription Image</Text>
                </TouchableOpacity>
                :
                <View>
                    <Image style={{height: RFValue(256), width: RFValue(256), resizeMode: 'contain'}} source={{uri: pickedImage}}/>
                    <AntDesign name="closecircle" size={20} color='red' style={{position: 'absolute', top: 0, right: 0, alignSelf: 'flex-end'}} onPress={() => {
                        setPickedImage(null)
                        setPrescriptionId(null)
                    }}/>
                </View>
                }
            </View>
            <View style={{marginHorizontal: RFPercentage(3), flexDirection: 'row'}}>
                <View style={{width: '30%'}}>
                    <Text>Med. Sl. No.</Text>
                    <Text style={{fontSize: RFValue(9)}}>(As Per Prescription)</Text>
                </View>
                <View style={{width: '30%'}}>
                    <TouchableWithoutFeedback onPress={() => {
                        setUnitSelected(!unitSelected)
                        setDaySelected(!daySelected)
                        inputList.forEach((inputList) => {
                            inputList.day = '';
                        })
                    }}>
                        <View style={{width: '100%', flexDirection: 'row'}}>
                            { unitSelected ?
                            <Ionicons name="checkbox-outline" size={20} color="black" style={{marginRight: 3}} />
                            :
                            <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="gray" style={{marginRight: 3}} />
                            }
                            <Text>Unit</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{width: '30%'}}>
                    <TouchableWithoutFeedback onPress={() => {
                        setUnitSelected(!unitSelected)
                        setDaySelected(!daySelected)
                        inputList.forEach((inputList) => {
                            inputList.unit = '';
                        })
                    }}>
                        <View style={{width: '100%', flexDirection: 'row'}}>
                            { daySelected ?
                            <Ionicons name="checkbox-outline" size={20} color="black" style={{marginRight: 3}} />
                            :
                            <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="gray" style={{marginRight: 3}} />
                            }
                            <Text>Day</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            {inputList.map((x, i) => {
                return (
                    <View style={{marginHorizontal: RFPercentage(3), marginTop: RFValue(10), flexDirection: 'row', justifyContent: 'space-between'}} key={i}>
                        <View style={{width: '25%', backgroundColor: Colors.blackSqueeze, padding: 6}}>
                            <TextInput
                                style={{width: '100%', color: Colors.danube}}
                                value={x.medicineSN}
                                onChangeText={text => handleInputChange('medicineSN', i, text)}
                                placeholder='Ex: 1' 
                                placeholderTextColor={Colors.danube}
                            />
                        </View>
                        <View style={{width: '25%', backgroundColor: Colors.blackSqueeze, padding: 6}}>
                            <TextInput
                                style={{width: '100%', color: Colors.danube}}
                                value={x.unit}
                                onChangeText={text => handleInputChange('unit', i, text)}
                                editable={unitSelected ? true : false}
                                placeholder='Ex: 1' 
                                placeholderTextColor={Colors.danube}
                            />
                        </View>
                        <View style={{width: '25%', backgroundColor: Colors.blackSqueeze, padding: 6}}>
                            <TextInput
                                style={{flex: 1, color: Colors.danube}}
                                value={x.day}
                                onChangeText={text => handleInputChange('day', i, text)}
                                editable={daySelected ? true : false}
                                placeholder='Ex: 1' 
                                placeholderTextColor={Colors.danube}
                            />
                        </View>
                        <View style={{width: '7%', flexDirection: 'row'}}>
                            {inputList.length - 1 === i && <TouchableOpacity style={{}} onPress={handleAddClick}>
                                <Entypo name="circle-with-plus" size={28} color={Colors.funBlue} style={{marginLeft: -RFPercentage(2)}} />
                            </TouchableOpacity>}
                            {inputList.length !== 1 && i === inputList.length -1 && <TouchableOpacity style={{}} onPress={() => {handleRemoveClick(i)}}>
                                <Entypo name="circle-with-minus" size={28} color={Colors.funBlue}/>
                            </TouchableOpacity>}
                            {inputList.length !== 1 && i !== inputList.length -1 && <TouchableOpacity style={{}} onPress={() => {handleRemoveClick(i)}}>
                                <Entypo name="circle-with-minus" size={28} color={Colors.funBlue} style={{marginLeft: -RFPercentage(2)}}/>
                            </TouchableOpacity>}
                        </View>
                    </View>
                )})
            }
            <View style={{marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2)}}>
                <View style={{width: '100%'}}>
                    <Text>Additional Note</Text>
                    <TextInput
                        style={{width: '100%', color: Colors.danube, backgroundColor: Colors.blackSqueeze, padding: 6, marginTop: RFPercentage(1)}}
                        value={additionalNote}
                        onChangeText={text => setAdditionalNote(text)}
                        multiline = {true}
                        numberOfLines = {4}
                        placeholder='Additional Note' 
                        placeholderTextColor={Colors.danube}
                    />
                </View>
            </View>
            <View style={{marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2)}}>
                <View style={{width: '100%'}}>
                    <Text>Delivery Details</Text>
                    <TextInput
                        style={{width: '100%', color: Colors.danube, backgroundColor: Colors.blackSqueeze, padding: 6, marginTop: RFPercentage(1)}}
                        value={deliveryDetails}
                        onChangeText={text => setDeliveryDetails(text)}
                        multiline = {true}
                        numberOfLines = {4}
                        placeholder='Your Address' 
                        placeholderTextColor={Colors.danube}
                    />
                </View>
            </View>
            <View style={{marginHorizontal: RFPercentage(5), marginTop: RFPercentage(2)}}>
                <TouchableWithoutFeedback onPress={() => {
                    setTermsAndConditionAgree(!termsAndConditionAgree)
                }}>
                    <View style={{width: '100%', flexDirection: 'row'}}>
                        {termsAndConditionAgree ?
                        <Ionicons name="checkbox-outline" size={20} color="black" style={{marginRight: 3}} />
                        :
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="gray" style={{marginRight: 3}} />
                        }
                        <Text>I've read and agree to the terms and conditions</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <TouchableOpacity disabled={previewButtonDisable} onPress={() => {
                setPreviewPopUp(true)
            }}>
                <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), borderWidth: 2, borderColor: Colors.funBlue, marginTop: RFPercentage(2), padding: 3}}>
                    <Text style={{fontSize: RFValue(15), color: Colors.resolutionBlue}}>Preview</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity disabled={submitButtonDisable} style={{marginBottom: RFPercentage(3)}} onPress={submitHandler}>
                <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(2), backgroundColor: Colors.funBlue, padding: 5}}>
                    <Text style={{fontSize: RFValue(15), color: 'white'}}>Submit</Text>
                </View>
            </TouchableOpacity>
            {isLoading &&
                <LoadingSpinner/>
            }
        </ScrollView>
    </View>
}

UploadPrescriptionScreen.navigationOptions = () => {
    return {
        headerTitle: 'Upload Prescription',
        headerRight: () => <Image style={{width: 32, height: 32, marginRight: 10, resizeMode: 'contain'}} source={Avatar}/>
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default UploadPrescriptionScreen