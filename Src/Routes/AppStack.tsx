import { StyleSheet, Text, View } from 'react-native'
import React ,{useState,useEffect}from 'react'
import { getCurrentUser } from '../Service/Service'
import Home from '../Screens/Home'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Routes from './Routes'
import Profile from '../Screens/Profile'


//Drawer component

const Drawer  = createDrawerNavigator();

const SideDrawer = () => {
  //username
const gettingUserName = () => {
    const [username, setUsername] = useState('');
        useEffect(()=> {
            const fetchUser = async () => {
                const user = await getCurrentUser();
                if(user){
                    setUsername(user.name);
                }
            }
            fetchUser();
        },[])
    return(username);
}
const userName = gettingUserName();

  return (
    <Drawer.Navigator initialRouteName={Routes.Home}>
      <Drawer.Screen 
      name={Routes.Home}
      component={Home}
      />
      <Drawer.Screen 
      name={Routes.Profile}
      component={Profile}
      options={{
        // headerShown:false
        headerTitle:userName
      }}
      />
    </Drawer.Navigator>
  )
}

//Stack

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator 
    initialRouteName={Routes.DRAWER_HOME}
    
    screenOptions={{
        headerTitleAlign:'center',
        headerShown:false
    }}
    >
      <Stack.Screen
      name={Routes.DRAWER_HOME}
      component={SideDrawer}
      />
    </Stack.Navigator>
  )
}

export default AppStack

const styles = StyleSheet.create({})