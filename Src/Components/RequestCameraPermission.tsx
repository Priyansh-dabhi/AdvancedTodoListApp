import { PermissionsAndroid, Platform } from 'react-native';

const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
        try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
            title: 'Camera Permission',
            message: 'App needs camera access to take profile photo',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
            },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
        console.warn(err);
        return false;
        }
    }
    return true; // iOS automatically handles this
    };
export default requestCameraPermission;