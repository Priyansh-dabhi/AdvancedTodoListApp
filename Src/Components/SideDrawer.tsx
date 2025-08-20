import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../Screens/Home';
import Profile from '../Screens/Profile';
import { getCurrentUser } from '../Service/Service';
import Routes from '../Routes/Routes';

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
const Drawer = createDrawerNavigator();

//username
const gettingUserName = () => {
  const [username, setUsername] = useState('');
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUsername(user.name);
      }
    };
    fetchUser();
  }, []);
  return username;
};
const userName = gettingUserName();

const SideDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName={Routes.Home}>
      <Drawer.Screen name={Routes.Home} component={Home} />
      <Drawer.Screen
        name={Routes.Profile}
        component={Profile}
        options={{
          // headerShown:false
          headerTitle: userName,
        }}
      />
    </Drawer.Navigator>
  );
};

export default SideDrawer;

const styles = StyleSheet.create({});
