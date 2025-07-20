import { StyleSheet, Text, View,Pressable, TouchableOpacity } from 'react-native'
import React ,{useContext, useEffect, useState} from 'react'
import { getCurrentUser, logout } from '../Service/Service';
import Snackbar from 'react-native-snackbar';
import { AuthContext } from '../Context/AppwriteContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../Routes/Routes';
import Login from './Login';
import Routes from '../Routes/Routes';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import gettingUserName, { gettingUserEmail } from '../Components/GettingUserDetail';

// type ProfileProp = NativeStackScreenProps<AppStackParamList,'Profile'>;


const Profile = () => {
    const navigation = useNavigation<any>();
    const user = {
        name: gettingUserName(),
        email: gettingUserEmail(),
        profilePic: 'https://via.placeholder.com/100', // Replace with real image or avatar
    };

    const stats = {
        completed: 24,
        pending: 6,
        total: 30,
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width: '100%'}}>
                    <Text style={{marginBottom: 12}}></Text>
                    <Pressable onPress={() => navigation.navigate(Routes.EditProfile)}>
                        <Ionicons name='create-outline' size={24} color="#555" style={{ position: 'absolute', top: 10, right: 10 }} />
                    </Pressable>
                </View>
            </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Profile Info */}
            <View style={styles.profileContainer}>
                <Image source={require('../Assets/Images/Pic3.jpg')} style={styles.avatar} />
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            {/* Task Stats */}
            <View style={styles.statsRow}>
                <StatCard label="Completed" value={stats.completed} />
                <StatCard label="Pending" value={stats.pending} />
                <StatCard label="Total" value={stats.total} />
            </View>

            {/* Settings List */}
            <View style={styles.settingsContainer}>
                <SettingsItem icon="moon" label="Dark Mode" />
                <SettingsItem icon="notifications" label="Notifications" />
                <SettingsItem icon="settings" label="Preferences" />
                <SettingsItem icon="lock-closed" label="Privacy & Security" />
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            </ScrollView>
        </View>
    );
    };

    const StatCard = ({ label, value }: { label: string; value: number }) => (
    <View style={styles.statCard}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
    );

    const SettingsItem = ({ icon, label }: { icon: any; label: string }) => (
    <TouchableOpacity style={styles.settingsItem}>
        <Ionicons name={icon} size={20} color="#555" />
        <Text style={styles.settingsLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
    );


export default Profile

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    },
    profileHeader: {
        backgroundColor: '#FF6B6B',
        paddingTop: 20,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 94,
    },
    profileContainer: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
        // marginTop: ,
        marginBottom: 10,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 12,
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#777',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    statCard: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#3D5AFE',
    },
    statLabel: {
        fontSize: 14,
        color: '#555',
    },
    settingsContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 20,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    settingsLabel: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        marginHorizontal: 20,
        borderRadius: 8,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
    },    
})