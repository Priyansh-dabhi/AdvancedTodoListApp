import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Home from '../Screens/Home'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Routes from './Routes'


const Drawer  = createDrawerNavigator();

const SideDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen 
      name={Routes.Home}
      component={Home}
      />
    </Drawer.Navigator>
  )
}

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator 
    initialRouteName='Home'
    
    screenOptions={{
        headerTitleAlign:'center',
        headerShown:true
    }}
    >
      {/* <Stack.Screen
      name={Routes.Home}
      component={Home}
      options={{
        
      }}
      /> */}
      <Stack.Screen
      name={Routes.DRAWER_HOME}
      component={SideDrawer}
      />
    </Stack.Navigator>
  )
}

export default AppStack

const styles = StyleSheet.create({})