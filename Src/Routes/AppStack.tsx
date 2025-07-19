import { StyleSheet, Text, View } from 'react-native'
import React ,{useState,useEffect}from 'react'
import { getCurrentUser } from '../Service/Service'
import Home from '../Screens/Home'
//navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Routes, { AppStackParamList } from './Routes'
import Profile from '../Screens/Profile'
import Login from '../Screens/Login'
import Signup from '../Screens/Signup'
// Bottom Tab component 

const Tab = createBottomTabNavigator();

const My_Tab = () => {
    //username
const [username, setUsername] = useState('');
const gettingUserName = () => {
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
  return(
    <Tab.Navigator initialRouteName='Home'
    screenOptions={{
      headerShown:false
    }}>
      <Tab.Screen
        name={Routes.Home}
        component={Home}
      />
      <Tab.Screen
        name={Routes.Profile}
        component={Profile}
        // options={{
        //   headerShown: true,
        //   headerTitle: userName 
          
        // }}
      />
    </Tab.Navigator>
  );
}

//Drawer component

const Drawer  = createDrawerNavigator();

const SideDrawer = () => {
  //username
const [username, setUsername] = useState('');
const gettingUserName = () => {
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
    <Drawer.Navigator initialRouteName={Routes.TabHome}>
      
      <Drawer.Screen 
      name={Routes.TabHome}
      component={My_Tab}
      options={{
        headerShown:true
      }}
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

const Stack = createNativeStackNavigator<AppStackParamList>();

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
      <Stack.Screen
      name={Routes.TabHome}
      component={My_Tab}
      />

      <Stack.Screen
        name={Routes.Login}
        component={Login} // ✅ Add this
      />
      <Stack.Screen
        name={Routes.Signup}
        component={Signup} // ✅ Add this
      />
    </Stack.Navigator>
  )
}

export default AppStack

const styles = StyleSheet.create({})