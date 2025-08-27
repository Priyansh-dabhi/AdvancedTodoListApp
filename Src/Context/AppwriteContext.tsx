
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../Service/Service";
import { Models } from "appwrite";
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Define the shape of the user object
type UserType = Models.User<Models.Preferences> | null;

// Define the shape of the context
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  user: UserType;
  setUser: (user: UserType) => void;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
});

// Create the provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true); // Renamed from 'loading' for clarity

  // Check user session on app start
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("AuthContext Error: Failed to get current user.", error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        // This will run after the try/catch block is complete
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // While the initial user check is running, show a loading screen.
  // This prevents the rest of the app from rendering prematurely.
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Once the check is complete, provide the auth values to the app.
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

// Custom hook for easy access to the context
export const useAuth = () => useContext(AuthContext);