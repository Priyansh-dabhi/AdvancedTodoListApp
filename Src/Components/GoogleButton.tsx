import { Pressable, Text, StyleSheet, Image, View, TouchableOpacity, } from 'react-native';
import React from 'react'
import images from '@/constants/images';

type GoogleButtonProps = {
  onPress: () => void;
};

const GoogleButton: React.FC<GoogleButtonProps> = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: "auto",
        alignSelf: "center",
        marginBottom: 30,
    }}
    >
      {/* Google Logo */}
      <Image
        source={images.googleLogo}
        style={{ width: 20, height: 20, marginRight: 10 }}
        resizeMode="contain"
      />

      {/* Button Text */}
      <Text style={{ fontSize: 16, fontWeight: "500", color: "#333" }}>
        Sign in with Google
      </Text>
    </Pressable>        
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#dadce0",
    borderRadius: 6,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    color: "#3c4043",
    fontWeight: "500",
  },
});

export default GoogleButton;