import { StatusBar, StyleSheet, useColorScheme, View, Linking, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { AuthContext, AuthProvider } from './Context/AppwriteContext';
import AuthStack from './Routes/AuthStack';
import AppStack from './Routes/AppStack';
import { getCurrentUser } from './Service/Service'; // 👈 Make sure this fetches Appwrite user
import SideDrawer from './Components/SideDrawer';

// const AppInner = () => {
//   const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

//   useEffect(() => {
//   const checkDeepLink = async () => {
//     const url = await Linking.getInitialURL();
//     if (url?.startsWith('appwrite://auth')) {
//       const user = await getCurrentUser();
//       if (user) setIsLoggedIn(true);
//     }
//   };
// }, []);


//   return (
//     <NavigationContainer>
//       {isLoggedIn ? <AppStack/> : <AuthStack />}
//     </NavigationContainer>
//   );
// };

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // <AuthProvider>
    //   <AppInner />
    // </AuthProvider>
    <AuthProvider>
      <NavigationContainer>
        <AppStack/>
      </NavigationContainer>
    </AuthProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
