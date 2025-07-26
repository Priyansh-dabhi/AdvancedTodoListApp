import React ,{useState,useEffect}from 'react'
import { getCurrentUser } from '../Service/Service';
    //username
const gettingUserName = () => {
    const [username, setUsername] = useState('');
        useEffect(()=> {
            const fetchUser = async () => {
                const user = await getCurrentUser();
                if(user){
                    setUsername(user.name);
                }
            }
            fetchUser();
        },[])
    return username;
}
export const gettingUserEmail = () => {
    const [email, setEmail] = useState(''); 
    useEffect(()=> {
        const fetchUser = async () => {
            const user = await getCurrentUser();
            if(user){
                setEmail(user.email);
            }
        }
        fetchUser();
    },[])   
    return email;
}

// GettingUserDetail.ts
// Pure async function (no hooks)
export const getUserName = async (): Promise<string> => {
    const user = await getCurrentUser();
    return user?.name ?? '';
};

export const getUserEmail = async (): Promise<string> => {
    const user = await getCurrentUser();
    return user?.email ?? '';
};


export default gettingUserName;
