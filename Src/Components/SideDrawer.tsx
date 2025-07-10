import { StyleSheet, Text, View } from 'react-native'
import React, { Profiler } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from '../Screens/Home';


const MyDrawer = createDrawerNavigator({
  screens: {
    Home: Home,
  },
});

const SideDrawer = () => {
  return (
    <MyDrawer.Navigator 
    initialRouteName='' 
    drawerContent={() => {}}>
      <MyDrawer.Screen 
      name='Home'
      component={Home}
      
      />
    </MyDrawer.Navigator>
  )
}

export default SideDrawer

const styles = StyleSheet.create({

})