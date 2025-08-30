import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native'
import React from 'react'
import  Modal  from 'react-native-modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';
import requestCameraPermission from './RequestCameraPermission';


type Props = {
    isVisible: boolean;
    onClose: () => void;
    onCreate: () => void
    onImageSelected: (uri: string) => void;
}

const EditProfileModal = ({isVisible,onClose,onCreate,onImageSelected}: Props) => {
    
    // Function to handle camera action
    const handleCameraLaunch = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
        Alert.alert('Permission Denied', 'Camera access is required to take a photo');
        return;
    }

    const result = await launchCamera({ mediaType: 'photo', saveToPhotos: true });

    if (result.didCancel) {
        return;
    }

    if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Unknown error');
        return;
    }

    const uri = result.assets?.[0]?.uri;
    if (uri) {
        onImageSelected(uri);
    }
    };
    // Function to handle gallery action
    const handleGallery = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if (result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri || '');
        onClose();
        } else {
        Alert.alert('No image selected');
        }
    };
    
    return (

        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropOpacity={0.5}
            style={styles.modal}
            onBackButtonPress={onClose} // Android back button support
            >
            <View style={styles.modalContent}>
                <TouchableOpacity style={styles.optionBtn} onPress={handleCameraLaunch}>
                    <Text style={styles.optionText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionBtn} onPress={handleGallery}>
                    <Text style={styles.optionText}>Choose from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionBtn} onPress={handleGallery}>
                    <Text style={styles.optionText}>Change Name</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.optionBtn, styles.cancelBtn]} onPress={onClose}>
                    <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default EditProfileModal

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 25,
    },
    optionBtn: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    cancelBtn: {
        borderBottomWidth: 0,
        marginTop: 10,
    },
    cancelText: {
        color: 'red',
        fontWeight: '600',
        textAlign: 'center',
    },
})