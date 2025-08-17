import { View, Text } from 'react-native'
import React from 'react'

export type AppStackParamList = {
    Home:undefined
    DrawerHome:undefined
    Profile:undefined
    TabHome:undefined
    Login:undefined
    Signup:undefined
    Temperary:undefined
    EditProfile:undefined
    Map:undefined
    EditTask:{taskId: number; taskItem?: string }
}

const Routes =  {
    Home:'Home',
    DRAWER_HOME: 'DrawerHome',
    Profile: 'Profile',
    TabHome: 'TabHome',
    Login: "Login",
    Signup: "Signup",
    Temperary: "Temperary",
    EditProfile: "EditProfile"
    ,Map: "Map",
    EditTask: 'EditTask'
}as const;

export default Routes