import {View,Text,TextInput,StyleSheet,TouchableOpacity,Image,ScrollView,} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const EditProfile = () => {
    return (
        <ScrollView style={styles.container}>

        <View style={styles.avatarContainer}>
            <Image
            source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/706/706830.png',
            }}
            style={styles.avatar}
            />
            <Text style={styles.name}>John Doe</Text>
        </View>

        <View style={styles.inputContainer}>
            <Icon name="account-outline" size={20} color="#555" style={styles.icon} />
            <TextInput placeholder="First Name" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
            <Icon name="account-outline" size={20} color="#555" style={styles.icon} />
            <TextInput placeholder="Last Name" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
            <Icon name="phone-outline" size={20} color="#555" style={styles.icon} />
            <TextInput placeholder="Phone" keyboardType="phone-pad" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
            <Icon name="email-outline" size={20} color="#555" style={styles.icon} />
            <TextInput placeholder="Email" keyboardType="email-address" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
            <Icon name="earth" size={20} color="#555" style={styles.icon} />
            <TextInput placeholder="Country" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
            <Icon name="map-marker-outline" size={20} color="#555" style={styles.icon} />
            <TextInput placeholder="City" style={styles.input} />
        </View>

        <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
        </ScrollView>
    );
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    },
    header: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
        color: '#333',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 15,
        paddingVertical: 5,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 5,
    },
    submitBtn: {
        backgroundColor: '#FF5A5F',
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 30,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})