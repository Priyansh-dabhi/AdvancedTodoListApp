import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getCurrentUser, account } from "../Service/Service"; // Make sure to import account
import { clearAllTasks } from "../db/database"; // Adjust path
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
  logout: () => Promise<void>;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  logout: async () => {},
});

// Create the provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- ADD THIS WRAPPED FUNCTION ---
  const handleSetIsLoggedIn = (status: boolean) => {
    console.log(`[AuthContext] ==> setIsLoggedIn called with: ${status}`);
    setIsLoggedIn(status);
  };
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
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      await clearAllTasks();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during logout:', error);
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // --- THIS IS THE FIX ---
  // useMemo prevents a new object from being created on every render.
  // This stabilizes the context value and stops the infinite loop.
  const authContextValue = useMemo(() => ({
    isLoggedIn,
    setIsLoggedIn: handleSetIsLoggedIn,
    user,
    setUser,
    logout: handleLogout,
  }), [isLoggedIn, user]); // The value only changes if isLoggedIn or user changes

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
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

export const useAuth = () => useContext(AuthContext);
