// src/Routes/Router.tsx

import React from 'react';
import { useAuth } from '../Context/AppwriteContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack'; // Make sure you have this import

const Router = () => {
  const { isLoggedIn } = useAuth();

  // This is the logic that was missing from your App.tsx
  // It ensures a complete swap of the navigation tree on auth change.
  return isLoggedIn ? <AppStack /> : <AuthStack />;
};

export default Router;