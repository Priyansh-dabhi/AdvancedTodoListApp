import { Pressable, Text, StyleSheet, Image, View, } from 'react-native';
import React from 'react'


type GoogleButtonProps = {
  onPress: () => void;
};

const GoogleButton: React.FC<GoogleButtonProps> = ({ onPress }) => {
    return (
        <Pressable style={styles.googleButton} onPress={onPress}>
        <View style={styles.googleContent}>
            <Image
            source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png',
            }}
            style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Sign in with Google</Text>
        </View>
        </Pressable>
    );
};

export default GoogleButton

const styles = StyleSheet.create({
        googleButton: {
        backgroundColor: '#ffffff',
        borderColor: '#dddddd',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        width: '80%',
        alignSelf: 'center',
        marginTop: 20,
        elevation: 2,
    },
    googleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
})