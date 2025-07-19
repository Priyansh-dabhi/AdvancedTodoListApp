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
const gettingUserEmail = () => {
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

export default gettingUserName;