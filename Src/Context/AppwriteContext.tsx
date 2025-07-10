import { createContext, useContext, useState, useEffect } from "react"
import { getCurrentUser } from "../Service/Service";

interface AuthContextType {
    isLoggedIn : boolean;
    setIsLoggedIn : (status:boolean) => void;

}

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    setIsLoggedIn: ()=> {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check user session on app start
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return(
    <AuthContext.Provider value={{isLoggedIn,setIsLoggedIn}}>
        {children}
    </AuthContext.Provider>
  );

}
