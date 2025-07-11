import { StyleSheet, Text, View } from 'react-native'
import React, { Profiler } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from '../Screens/Home';


// ✅ Optional: Custom Drawer Component
const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Welcome!</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};
const Drawer  = createDrawerNavigator();

const SideDrawer = () => {
  return (
    <Drawer.Navigator 
    initialRouteName='Home' 
    drawerContent={(props) => <CustomDrawerContent{...props}/>}
    screenOptions={{
      headerShown:true,
    }}>
      <Drawer.Screen 
      name='Home'
      component={Home}
      
      />
    </Drawer.Navigator>
  )
}

export default SideDrawer

const styles = StyleSheet.create({

})