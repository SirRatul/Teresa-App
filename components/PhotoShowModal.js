import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Alert } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { WebView } from 'react-native-webview';
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";

const PhotoShowModal = (props) => {
    const downloadFile = (uri) => {
        let filename = uri.split("/");
        filename = filename[filename.length - 1];
        let fileUri = FileSystem.documentDirectory + filename;
        FileSystem.downloadAsync(uri, fileUri).then(({ uri }) => {
            saveFile(uri);
        }).catch(error => {
            Alert.alert("Error", "Couldn't download photo");
            console.error(error);
        });
    }
    const saveFile = async(fileUri) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === "granted") {
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            await MediaLibrary.createAlbumAsync("Download", asset, false);
            Alert.alert("Success", "Image was successfully downloaded!");
        }
    }

    return <Modal animationType="slide" transparent={true} visible={true} onRequestClose={props.onClear}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <ImageViewer imageUrls={[{
                // url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
                url: 'https://'+props.imageUri
            }]} backgroundColor={'white'} onSave={async(url) =>{
                // downloadFile('https://avatars2.githubusercontent.com/u/7970947?v=3&s=460')
                downloadFile('https://'+props.imageUri)
            }}/>
            {/* <TouchableOpacity onPress={() => {props.orderHandler('https://'+props.imageUri)}} style={{marginBottom: RFValue(20)}}>
                <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: RFPercentage(3), marginTop: RFPercentage(3), backgroundColor: Colors.funBlue, padding: 6}}>
                    <Text style={{fontSize: RFValue(18), color: 'white'}}>Order Medicine</Text>
                </View>
            </TouchableOpacity> */}
            <AntDesign name="closecircle" size={20} color={Colors.funBlue} style={{position: 'absolute', top: RFValue(10), right: RFValue(10), alignSelf: 'flex-end'}} onPress={props.onClear}/>
        </View>
    </Modal>
}
   
const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default PhotoShowModal