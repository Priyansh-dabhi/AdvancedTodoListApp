import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Context/AppwriteContext';
import Snackbar from 'react-native-snackbar';
import { logout } from '../Service/Service';
import Routes from '../Routes/Routes';

const Temperary = () => {
    const [username, setUsername] = useState('');
    const { setIsLoggedIn } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    
      // handling logout
        const handleLogout = async () => {
            try {
            await logout();
            setIsLoggedIn(false);
            Snackbar.show({
                text: 'Logged out successfully!',
                duration: Snackbar.LENGTH_SHORT,
            });
            } catch (err) {
            console.log('Logout Error:', err);
            Snackbar.show({
                text: 'Logout failed',
                duration: Snackbar.LENGTH_SHORT,
            });
            }
        };
    return (
        <View>

                    <Pressable style={styles.logoutBtn} onPress={()=> {navigation.navigate(Routes.Login)}}>
                        <Text style={styles.logoutText}>SignIn</Text>
                    </Pressable>                    
                    <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </Pressable> 
        </View>
    )
}

export default Temperary

const styles = StyleSheet.create({
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