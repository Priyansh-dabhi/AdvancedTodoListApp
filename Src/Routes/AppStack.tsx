  import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
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
  // User Detail
  import  GettingUserDetail  from '../Components/GettingUserDetail'
  // icons library
  import { DrawerActions,useNavigation } from '@react-navigation/native';
  import Ionicons from 'react-native-vector-icons/Ionicons';
import Temperary from '../Screens/Temperary'
import EditProfile from '../Screens/EditProfile'
import Map from '../Screens/Google Maps/Map'


  //Drawer component

  // const Drawer  = createDrawerNavigator();

  // const SideDrawer = () => {
  //   const userName = GettingUserDetail();
  //   return (
  //     <Drawer.Navigator initialRouteName={Routes.TabHome} >
        
  //       <Drawer.Screen 
  //       name={Routes.TabHome}
  //       component={My_Tab}
  //       options={{
  //         headerShown:false
  //       }}
  //       />
  //       <Drawer.Screen 
  //       name={Routes.Profile}
  //       component={Profile}
  //       options={{
  //         headerShown:true,
  //         headerTitle:userName
  //       }}
  //       />
  //     </Drawer.Navigator>
  //   )
  // }



  // Bottom Tab component 
  const Tab = createBottomTabNavigator();



  const My_Tab = () => {
    const navigation = useNavigation<any>();
    return(
      <Tab.Navigator initialRouteName= {Routes.Home}
      screenOptions={{
        headerShown:false
      }}>


        <Tab.Screen
          name={Routes.Home}
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name={Routes.Profile}
          component={Profile}
          options={{
            
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name={Routes.Temperary}
          component={Temperary}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }


  //Stack

  const Stack = createNativeStackNavigator<AppStackParamList>();

  const AppStack = () => {
    return (
      <Stack.Navigator  
      
      
      screenOptions={{
          headerTitleAlign:'center',
          headerShown:true,
          headerStyle: {
              // backgroundColor: '#f02e65',
              backgroundColor: '#FF6B6B',
          },
      }}
      >
        {/* <Stack.Screen
        name={Routes.DRAWER_HOME}
        component={SideDrawer}
        options={{
          headerShown: false, // Hide the header for the drawer
        }}
        /> */}
        <Stack.Screen
        name={Routes.TabHome}
        component={My_Tab}
        options={{
          headerShown: false, // Hide the header for the tab navigator
        }}
        />

        <Stack.Screen
          name={Routes.Login}
          component={Login}
        />
        <Stack.Screen
          name={Routes.Signup}
          component={Signup} 
        />
        <Stack.Screen
          name={Routes.EditProfile}
          component={EditProfile} 
          options={{
            headerBackTitle:'Back',
            
            headerTitle:'Edit Profile',
          }}
        />
        <Stack.Screen
          name={Routes.Map}
          component={Map} 
          options={{
            headerBackTitle:'Back',
            headerTitle:'Google Map',
          }}
          />
      </Stack.Navigator>
    )
  }

  export default AppStack

  const styles = StyleSheet.create({})