import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Home from '../Screens/Home'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Routes from './Routes'
import Profile from '../Screens/Profile'

//Drawer component

const Drawer  = createDrawerNavigator();

const SideDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName={Routes.Home}>
      <Drawer.Screen 
      name={Routes.Home}
      component={Home}
      />
      <Drawer.Screen 
      name={Routes.Profile}
      component={Profile}
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