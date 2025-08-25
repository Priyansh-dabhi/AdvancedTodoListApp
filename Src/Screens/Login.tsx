import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import React, { useState, useContext } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../Routes/AuthStack';
import { login } from '../Service/Service';
import { AuthContext } from '../Context/AppwriteContext';
import Snackbar from 'react-native-snackbar';
//google signin
// import { googleSignIn } from '../Service/Service';
import GoogleButton from '../Components/GoogleButton';
import Routes, { AppStackParamList } from '../Routes/Routes';
import { useNavigation } from '@react-navigation/native';

//Navigation
// type loginScreenProps = NativeStackScreenProps<AppStackParamList,'Login'>;

const Login = () => {
  const { setIsLoggedIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const usenavigation = useNavigation<any>();

  //  Handle Login Logic:
  const handleLogin = async () => {
    setError(''); // Clear previous errors

    if (!email || !password) {
      setError('All fields are required');
      return;
    } else {
      try {
        const session = await login({ email, password });
        if (session) {
          setIsLoggedIn(true);
          console.log(setIsLoggedIn);
          Snackbar.show({
            text: 'Login successful!',
            duration: Snackbar.LENGTH_SHORT,
          });
          usenavigation.reset({
            index: 0,
            routes: [{name: Routes.TabHome}],
          })
        } else {
          setError('Login Failed!');
        }
      } catch (err: any) {
        console.log('Login Error:', err);
        setError(err?.message || 'Something went wrong');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.appName}>Appwrite Auth</Text>

        {/* Email */}
        <TextInput
          keyboardType="email-address"
          value={email}
          onChangeText={text => setEmail(text)}
          placeholderTextColor={'#AEAEAE'}
          placeholder="Email"
          style={styles.input}
        />

        {/* Password */}
        <TextInput
          value={password}
          onChangeText={text => setPassword(text)}
          placeholderTextColor={'#AEAEAE'}
          placeholder="Password"
          style={styles.input}
          secureTextEntry
        />

        {/* Validation error */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Login button */}
        <Pressable
          onPress={handleLogin}
          style={[styles.btn, { marginTop: error ? 10 : 20 }]}
        >
          <Text style={styles.btnText}>Login</Text>
        </Pressable>

        {/* Sign up navigation */}
        <Pressable
          onPress={() => usenavigation.navigate(Routes.Signup)}
          style={styles.signUpContainer}
        >
          <Text style={styles.noAccountLabel}>
            Don't have an account?{'  '}
            <Text style={styles.signUpLabel}>Create an account</Text>
          </Text>
        </Pressable>
        {/* <GoogleButton onPress={googleSignIn}/> */}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    height: '100%',
  },
  appName: {
    color: '#f02e65',
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fef8fa',
    padding: 10,
    height: 40,
    alignSelf: 'center',
    borderRadius: 5,

    width: '80%',
    color: '#000000',

    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 1,
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginTop: 10,
  },
  btn: {
    backgroundColor: '#ffffff',
    padding: 10,
    height: 48,

    alignSelf: 'center',
    borderRadius: 5,
    width: '80%',
    marginTop: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 3,
  },
  btnText: {
    color: '#484848',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signUpContainer: {
    marginTop: 80,
  },
  noAccountLabel: {
    color: '#484848',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  signUpLabel: {
    color: '#1d9bf0',
  },
});

export default Login;
