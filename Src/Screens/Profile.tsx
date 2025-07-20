import { StyleSheet, Text, View,Pressable } from 'react-native'
import React ,{useContext, useEffect, useState} from 'react'
import { getCurrentUser, logout } from '../Service/Service';
import Snackbar from 'react-native-snackbar';
import { AuthContext } from '../Context/AppwriteContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../Routes/Routes';
import Login from './Login';
import Routes from '../Routes/Routes';
import { useNavigation } from '@react-navigation/native';


// type ProfileProp = NativeStackScreenProps<AppStackParamList,'Profile'>;


const Profile = () => {

    const navigation = useNavigation<any>();



return (
    <View style={styles.container}>
        
    </View>
    );
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
        color: '#333',
    },
    logoutBtn: {
        backgroundColor: '#f02e65',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
})