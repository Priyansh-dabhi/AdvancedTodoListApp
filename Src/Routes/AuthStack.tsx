import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

//navigation
import Signup from '../Screens/Signup'
import Login from '../Screens/Login'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Routes from './Routes'
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
              />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})

export default AuthStack
