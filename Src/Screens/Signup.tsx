import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, Pressable, Platform } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthStackParamList } from '../Routes/AuthStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createAccount, login } from '../Service/Service'
import Snackbar from 'react-native-snackbar';
import { AuthContext } from '../Context/AppwriteContext';
import Routes, { AppStackParamList } from '../Routes/Routes';
import { useNavigation } from '@react-navigation/native';


// type signupScreenProps = NativeStackScreenProps<AppStackParamList, 'Signup'>;


const Signup = () => {
//context
    const {setIsLoggedIn} = useContext(AuthContext)
// states
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [repeatPassword, setRepeatPassword] = useState('');
const [error, setError] = useState('');
const usenavigation = useNavigation<any>();

//Signup Logic Function

// Signup Logic Function
const handleSignup = async () => {
    setError('');

    if (!name || !email || !password || !repeatPassword) {
        setError('All fields are required');
        return;
    }

    if (password !== repeatPassword) {
        setError('Passwords do not match');
        return;
    }

    try {
        // Step 1: Create user account
        const res = await createAccount({ name, email, password });

        if (!res) {
        setError('Signup failed. Try again');
        return;
        }

        // Step 2: Immediately create session for auto-login
        const session = await login({ email, password });

        if (session) {
        setIsLoggedIn(true);
        
        Snackbar.show({
            text: 'Signup successful!',
            duration: Snackbar.LENGTH_SHORT,
        });

        usenavigation.reset({
            index: 0,
            routes: [{ name: Routes.TabHome }],
        });
        } else {
        setError('Could not start session after signup');
        }
    } catch (err) {
        console.log('Signup Error:', err);
        setError('Something went wrong');
    }
};




    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.formContainer}>
        <Text style={styles.appName}>Appwrite Auth</Text>

        {/* Name */}
        <TextInput
            value={name}
            onChangeText={text => {
            setError('');
            setName(text);
            }}
            placeholderTextColor={'#AEAEAE'}
            placeholder="Name"
            style={styles.input}
        />

        {/* Email */}
        <TextInput
            value={email}
            keyboardType="email-address"
            onChangeText={text => {
            setError('');
            setEmail(text);
            }}
            placeholderTextColor={'#AEAEAE'}
            placeholder="Email"
            style={styles.input}
        />

        {/* Password */}
        <TextInput
            value={password}
            onChangeText={text => {
            setError('');
            setPassword(text);
            }}
            placeholderTextColor={'#AEAEAE'}
            placeholder="Password"
            secureTextEntry
            style={styles.input}
        />

        {/* Repeat password */}
        <TextInput
            secureTextEntry
            value={repeatPassword}
            onChangeText={text => {
            setError('');
            setRepeatPassword(text);
            }}
            placeholderTextColor={'#AEAEAE'}
            placeholder="Repeat Password"
            style={styles.input}
        />

        {/* Validation error */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Signup button */}
        <Pressable
            onPress={handleSignup}
            style={[styles.btn, {marginTop: error ? 10 : 20}]}>
            <Text style={styles.btnText}>Sign Up</Text>
        </Pressable>

        {/* Login navigation */}
        <Pressable
            onPress={() => usenavigation.navigate(Routes.Login)}
            style={styles.loginContainer}>
            <Text style={styles.haveAccountLabel}>
            Already have an account?{'  '}
            <Text style={styles.loginLabel}>Login</Text>
            </Text>
        </Pressable>
        </View>
    </KeyboardAvoidingView>
  )
}

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
        marginTop: 10,

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
    loginContainer: {
        marginTop: 60,
    },
    haveAccountLabel: {
        color: '#484848',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
    loginLabel: {
        color: '#1d9bf0',
    },
})

export default Signup
