import { createContext, useContext, useState, useEffect } from "react"
import { getCurrentUser } from "../Service/Service";
import { Models } from "appwrite"; // for typing the User object


interface AuthContextType {
    isLoggedIn : boolean;
    setIsLoggedIn : (status:boolean) => void;
    user: Models.User | null; // store actual user object
    setUser: (user: Models.User<any> | null) => void;

}

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    setIsLoggedIn: ()=> {},
    user: null,
    setUser: ()=> {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Models.User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check user session on app start
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
  }, []);

  return(
    <AuthContext.Provider value={{isLoggedIn: !!user,setIsLoggedIn,user,setUser}}>
        {loading? null : children}
    </AuthContext.Provider>
  );

}

export const useAuth = () => useContext(AuthContext);