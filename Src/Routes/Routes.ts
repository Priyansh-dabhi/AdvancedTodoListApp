import { View, Text } from 'react-native'
import React from 'react'

export type AppStackParamList = {
    Home:undefined
    DrawerHome:undefined
    Profile:undefined
    TabHome:undefined
}

const Routes =  {
    Home:'Home',
    DRAWER_HOME: 'DrawerHome',
    Profile: 'Profile',
    TabHome: 'TabHome'
}

export default Routes