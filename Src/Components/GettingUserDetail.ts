import React ,{useState,useEffect}from 'react'
import { getCurrentUser } from '../Service/Service';
    //username
const [username, setUsername] = useState('');
const gettingUserName = () => {
        useEffect(()=> {
            const fetchUser = async () => {
                const user = await getCurrentUser();
                if(user){
                    setUsername(user.name);
                }
            }
            fetchUser();
        },[])
    return(username);
}
const userName = gettingUserName();