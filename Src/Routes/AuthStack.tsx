import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

//navigation
import Signup from '../Screens/Signup'
import Login from '../Screens/Login'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
export type AuthStackParamList = {
    Signup:undefined
    Login:undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>();


const AuthStack = () => {
  return (
    <Stack.Navigator 
    // initialRouteName='Home'
    screenOptions={{
        headerTitleAlign:'center'
        
    }}
    >
      <Stack.Screen
      name='Signup'
      component={Signup}
      />
      <Stack.Screen
      name='Login'
      component={Login}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})

export default AuthStack
