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
      // fetching users
      useEffect(()=> {
          const fetchUser = async () => {
              const user = await getCurrentUser();
              if(user){
                  setUsername(user.name);
              }
          }
          fetchUser();
      },[])
  return (
    <View style={styles.container}>
                <Text style={styles.title}>Welcome <Text style={{color:'#f02e65'}}>{username}</Text> to Home Screen 🎉 </Text>
    
                <Pressable style={styles.logoutBtn} onPress={()=> {navigation.navigate(Routes.Login)}}>
                    <Text style={styles.logoutText}>SignIn</Text>
                </Pressable>                    
                <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </Pressable>                    
      </View>
  )
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