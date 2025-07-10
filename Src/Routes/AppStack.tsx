import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Home from '../Screens/Home'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
export type AppStackParamList = {
    Home:undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator 
    // initialRouteName='Home'
    screenOptions={{
        headerTitleAlign:'center',
        
    }}
    >
      <Stack.Screen
      name='Home'
      component={Home}
      options={{
        
      }}
      />
    </Stack.Navigator>
  )
}

export default AppStack

const styles = StyleSheet.create({})