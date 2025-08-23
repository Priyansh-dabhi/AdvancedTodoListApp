// src/hooks/useUser.ts
import { useState, useEffect } from 'react';
import { Models } from 'appwrite';

// Import your function from your service file
import { getCurrentUser } from '../Service/Service';

export const useUser = () => {
  // State for storing the user object. Use the Appwrite type for safety.
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    
    // State to let your components know when the user data is being fetched.
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
        try {
            const userData = await getCurrentUser();
            if (userData) {
            setUser(userData);
            }
        } catch (error) {
            // The error is already handled by Snackbar in your function,
            // but you could add more logic here if needed.
            setUser(null);
        } finally {
            setIsLoading(false);
        }
        };

        loadUser();
    }, []); // The empty array `[]` means this effect runs only once when the hook is first used.

    // Return the user data and loading state for components to use.
    return { user, isLoading };
};