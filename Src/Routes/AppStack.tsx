import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../Service/Service';
import Home from '../Screens/Home';
//navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Routes, { AppStackParamList } from './Routes';
import Profile from '../Screens/Profile';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
// User Detail
import GettingUserDetail from '../Components/GettingUserDetail';
// icons library
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Temperary from '../Screens/Temperary';
import EditProfile from '../Screens/EditProfile';
import Map from '../Screens/GoogleMaps/Map';
import EditTask from '../Screens/EditTask';
import icons from '@/constants/icons';
// context
import { useAuth } from '../Context/AppwriteContext';


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
  return (
    <Tab.Navigator
      initialRouteName={Routes.Home}
      screenOptions={{
        headerShown: false,
      }}
    >
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
  options={({ navigation }) => ({
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person" color={color} size={size} />
    ),
    headerShown: true,
    headerTitle: '',
    headerStyle: {
      backgroundColor: '#6C63FF',
    },
    // headerRight: () => (
    //   <Pressable
    //     onPress={() => navigation.navigate(Routes.EditProfile)}
    //     style={{ marginRight: 16 }}
    //   >
    //     <Ionicons
    //       name="create-outline"
    //       size={24}
    //       color="white"
    //     />
    //   </Pressable>
    // ),
  })}
/>
      {/* <Tab.Screen
        name={Routes.Temperary}
        component={Temperary}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.Map}
        component={Map}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" color={color} size={size} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

//Stack

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  const {isLoggedIn} = useAuth();
  const navigation = useNavigation<any>();
  return (
    <Stack.Navigator
      initialRouteName= {Routes.TabHome}
      screenOptions={{
        headerTitleAlign: 'center',
        headerShown: true,
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

      {/* <Stack.Screen 
        name={Routes.Login}
        component={Login} 
        options={{
          headerStyle: {
            backgroundColor: '#4A90E2',
          },
          
          headerShown: true,
        }}
        />
      <Stack.Screen 
        name={Routes.Signup}
        component={Signup} 
        options={{
          headerStyle: {
            backgroundColor: '#4A90E2',
          },
          
          headerShown: true,
        }}
        /> */}
      <Stack.Screen
        name={Routes.EditProfile}
        component={EditProfile}
        options={{
          headerStyle: { backgroundColor: '#4A90E2' },
          // headerBackTitle: 'Back',
          headerShown:true
          // headerTitle: 'Edit Profile',
        }}
      />
      <Stack.Screen
        name={Routes.Map}
        component={Map}
        options={{
          // headerBackTitle: 'Back',
          // headerTitle: 'Google Map',
        }}
      />
      <Stack.Screen
        name={Routes.EditTask}
        component={EditTask}
        options={{
          headerStyle: { backgroundColor: '#6C63FF' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={icons.back}
                style={{ width: 26, height: 26, marginLeft: 8 }}
              />
            </TouchableOpacity>
          ),
          headerTitle: '',
          headerRight: () => (
            <Pressable onPress={() => console.log('Menu pressed')}>
              <Ionicons
                name="ellipsis-vertical"
                size={22}
                color="#000"
                style={{ marginRight: 8 }}
              />
            </Pressable>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
