import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native'
import React ,{useContext, useEffect, useState} from 'react'
import { AuthContext } from '../Context/AppwriteContext';
import { getCurrentUser, logout } from '../Service/Service';
import Snackbar from 'react-native-snackbar';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
// Icons
import Icon from 'react-native-vector-icons/Ionicons';


const Home = () => {
    // const [username, setUsername] = useState('');
    // const { setIsLoggedIn } = useContext(AuthContext);
    // // handling logout
    // const handleLogout = async () => {
    //     try {
    //     await logout();
    //     setIsLoggedIn(false);
    //     Snackbar.show({
    //         text: 'Logged out successfully!',
    //         duration: Snackbar.LENGTH_SHORT,
    //     });
    //     } catch (err) {
    //     console.log('Logout Error:', err);
    //     Snackbar.show({
    //         text: 'Logout failed',
    //         duration: Snackbar.LENGTH_SHORT,
    //     });
    //     }
    // };
    // // fetching users
    // useEffect(()=> {
    //     const fetchUser = async () => {
    //         const user = await getCurrentUser();
    //         if(user){
    //             setUsername(user.name);
    //         }
    //     }
    //     fetchUser();
    // },[])
    return (

        <View style={styles.container}>
            {/* <Text style={styles.title}>Welcome <Text style={{color:'#f02e65'}}>{username}</Text> to Home Screen 🎉 </Text>

            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </Pressable>                     */}

            <ScrollView>
                <Text>Hello</Text>
            </ScrollView>
                {/* Floating "+" button */}
                <TouchableOpacity
                    style={styles.fab}
                    // onPress={() => setModalVisible(true)}
                >
                    <Icon name="add" size={38} color="white" />

                </TouchableOpacity>
        </View>
        
            

    )
}

export default Home

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
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#1E90FF',
        width: 70,
        height: 70,
        borderRadius: 35, // Half of width/height
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,

    },
})