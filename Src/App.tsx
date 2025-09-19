// import React, { useEffect } from 'react';
// import { StyleSheet, useColorScheme, Linking } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { AuthProvider, useAuth } from './Context/AppwriteContext';
// import { TaskProvider } from './Context/TaskContext';
// import Router from './Routes/Router';
// import { getCurrentUser, } from './Service/Service';
// // import { requestUserPermission, getFCMToken } from '../notifications'
// function AppInner() {
//   const { setUser, setIsLoggedIn } = useAuth();

//   // ✅ ADD THIS NEW useEffect BLOCK
//   // This effect runs once on app startup to check for an existing session.
//   useEffect(() => {
//     const checkExistingSession = async () => {
//       const user = await getCurrentUser();
//       if (user) {
//         setUser(user);
//         setIsLoggedIn(true);
//         console.log('Found existing user session:', user.email);
//       }
//     };

//     checkExistingSession();
//   }, [setUser, setIsLoggedIn]); // Dependencies ensure this runs once

//   // This is your existing deep link handler - it is correct.
//   useEffect(() => {
//     const handleDeepLink = async ({ url }: { url: string }) => {
//       console.log('Deep link received:', url);
//       if (url.startsWith('appwrite-callback-taskmanager://')) {
//         await new Promise(res => setTimeout(res, 500));
//         const user = await getCurrentUser();
//         if (user) {
//           setUser(user);
//           setIsLoggedIn(true);
//           console.log('User logged in via Google:', user.email);
//         }
//       }
//     };

//     Linking.getInitialURL().then(url => {
//       if (url) handleDeepLink({ url });
//     });

//     const sub = Linking.addEventListener('url', handleDeepLink);
//     return () => sub.remove();
//   }, [setUser, setIsLoggedIn]);

// // async function registerDeviceForPush() {
// //   const userId = await getCurrentUser();
// //   const fcmToken = await getFCMToken();

// //   if (userId && fcmToken) {
// //     await saveToken(userId.$id, fcmToken);
// //     console.log("FCM token saved to Appwrite!");
// //   } else {
// //     console.warn("User ID or FCM token missing, not saved");
// //   }
// // }
// //   // Request notification permissions and get FCM token
// //   useEffect(() => {
// //     const setupNotifications = async () => {
// //       const hasPermission = await requestUserPermission();
// //       if (hasPermission) {
// //         const token = await getFCMToken();
// //         if (token) {
// //           // 🔽 Send this token to Appwrite in Step 2
// //           await registerDeviceForPush();
// //         }
// //       }
// //     };

// //     setupNotifications();
// //   }, []);
//   return (
//     <NavigationContainer>
//       <Router />
//     </NavigationContainer>
//   );
// }

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <AuthProvider>
//       <TaskProvider>
//         <AppInner />
//       </TaskProvider>
//     </AuthProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;

import { StatusBar, StyleSheet, useColorScheme, View, Linking, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { AuthContext, AuthProvider, useAuth } from './Context/AppwriteContext';
import AuthStack from './Routes/AuthStack';
import AppStack from './Routes/AppStack';
import { addTask, getCurrentUser, syncOfflineTasks } from './Service/Service'; // 
// import { getCurrentUser, saveToken } from './Service/Service'; // 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Router from './Routes/Router';
// database
// import { createTables, getDBConnection } from './DB/Database';
import SQLite from 'react-native-sqlite-storage'
import {  getUnsyncedTasksAsync, initDB, insertOrUpdateTask } from './DB/Database';
import { TaskProvider } from './Context/TaskContext';
import { getFCMToken, requestUserPermission } from '@/notifications';
import { TaskSummaryProvider } from './Context/TaskSummaryContext';
import NetInfo from '@react-native-community/netinfo';
import { Task } from './Types/Task';

          
function App() {
    // This is your existing deep link handler - it is correct.
    const { setUser, setIsLoggedIn } = useAuth();

  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      console.log('Deep link received:', url);
      if (url.startsWith('appwrite-callback-taskmanager://')) {
        await new Promise(res => setTimeout(res, 500));
        const user = await getCurrentUser();
        if (user) {
          setUser(user);
          setIsLoggedIn(true);
          console.log('User logged in via Google:', user.email);
        }
      }
    };

    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });

    const sub = Linking.addEventListener('url', handleDeepLink);
    return () => sub.remove();
  }, [setUser, setIsLoggedIn]);



function SyncHandler() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return Alert.alert("No user logged in, cannot sync tasks.");
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        console.log("📶 Back online → syncing unsynced tasks...");
        syncOfflineTasks(user.$id);
      }
    });
    return () => unsubscribe();
  }, [user]);

  return null;
}


  // Inititalize database when app starts
  useEffect(() => {
      initDB();
  }, []);

  return (
    // <AuthProvider>
    //   <AppInner />
    // </AuthProvider>
<AuthProvider>
  <SyncHandler />
  <TaskProvider>
    <TaskSummaryProvider>
      <NavigationContainer>
        <Router/>
      </NavigationContainer>
    </TaskSummaryProvider>
  </TaskProvider>
</AuthProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
