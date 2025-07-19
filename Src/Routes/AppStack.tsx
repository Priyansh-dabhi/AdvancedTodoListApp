  import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
  import React ,{useState,useEffect}from 'react'
  import { getCurrentUser } from '../Service/Service'
  import Home from '../Screens/Home'
  //navigation
  import { createNativeStackNavigator } from '@react-navigation/native-stack'
  import { createDrawerNavigator } from '@react-navigation/drawer'
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
  import Routes, { AppStackParamList } from './Routes'
  import Profile from '../Screens/Profile'
  import Login from '../Screens/Login'
  import Signup from '../Screens/Signup'

  // User Detail
  import { userName } from '../Components/GettingUserDetail'
  //Drawer component

  const Drawer  = createDrawerNavigator();

  const SideDrawer = () => {

    return (
      <Drawer.Navigator initialRouteName={Routes.TabHome} >
        
        <Drawer.Screen 
        name={Routes.TabHome}
        component={My_Tab}
        options={{
          headerShown:false
        }}
        />
        <Drawer.Screen 
        name={Routes.Profile}
        component={Profile}
        options={{
          // headerShown:false
          headerTitle:userName
        }}
        />
      </Drawer.Navigator>
    )
  }



  // Bottom Tab component 
  import { DrawerActions,useNavigation } from '@react-navigation/native';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  const Tab = createBottomTabNavigator();



  const My_Tab = () => {
    const navigation = useNavigation<any>();
    return(
      <Tab.Navigator initialRouteName='Home'
      screenOptions={{
        headerShown:false
      }}>

        <Tab.Screen
          name="Menu"
          component={() => null} // Empty component; we only want the icon
          options={{
            tabBarButton: () => (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}
              >
                <Ionicons name="menu" size={28} color="black" />
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen
          name={Routes.Home}
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name={Routes.Profile}
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }


  //Stack

  const Stack = createNativeStackNavigator<AppStackParamList>();

  const AppStack = () => {
    return (
      <Stack.Navigator  
      initialRouteName={Routes.DRAWER_HOME}
      
      screenOptions={{
          headerTitleAlign:'center',
          headerShown:true,
          headerStyle: {
              backgroundColor: '#f02e65',
          },
      }}
      >
        <Stack.Screen
        name={Routes.DRAWER_HOME}
        component={SideDrawer}
        
        />
        {/* <Stack.Screen
        name={Routes.TabHome}
        component={My_Tab}
        /> */}

        <Stack.Screen
          name={Routes.Login}
          component={Login}
        />
        <Stack.Screen
          name={Routes.Signup}
          component={Signup} 
        />
      </Stack.Navigator>
    )
  }

  export default AppStack

  const styles = StyleSheet.create({})