// import { Linking } from 'react-native';
// import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Client, Account, ID, Databases } from 'appwrite';
import Snackbar from 'react-native-snackbar';
import { OAuthProvider } from 'appwrite';
import {APPWRITE_ENDPOINT,APPWRITE_PROJECT_ID,APPWRITE_DATABASE_ID,APPWRITE_COLLECTION_ID} from '@env';

// console.log('Endpoint:', `'${APPWRITE_ENDPOINT}'`, 'Length:', APPWRITE_ENDPOINT.length);
// console.log('Project ID:', `'${APPWRITE_PROJECT_ID}'`, 'Length:', APPWRITE_PROJECT_ID.length);

const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT.trim()) 
  .setProject(APPWRITE_PROJECT_ID.trim());

  // Authentication
  // instance of Account class which provides below methods
const account = new Account(client);
const databases = new Databases(client);
type createUserAccount = {
  name:string;
  email:string;
  password:string;
}
type loginUser = {
  email:string;
  password:string;
}

// SignUp
export const createAccount = async ({email, password, name}:createUserAccount) => {
  try{
    const response = await account.create(ID.unique(), email, password, name);
    return response;
  }catch (error){
    Snackbar.show({
      text:String(error),
      duration:Snackbar.LENGTH_SHORT,
    })
    return null;
  }
}

// Login

export const login = async ({email, password}:loginUser) => {
  try{
    const session =  await account.createEmailPasswordSession(email, password);
    return session;
  }catch (error) {
    Snackbar.show({
      text: String(error),
      duration: Snackbar.LENGTH_SHORT,
    })
    return null;
  }
}
  
// Get current login user

export const getCurrentUser = async () => {
  try{
    const user = await account.get();
    return user;
    
  }catch (error){
    Snackbar.show({
      text: String(error),
      duration: Snackbar.LENGTH_SHORT,
    })
    return null;
  }
}
  
// Logout

export const logout = async () =>{
  try{
    await account.deleteSession('current');
    return true;
  }catch (error){
    Snackbar.show({
      text: String(error),
      duration: Snackbar.LENGTH_SHORT,
    })
    return null;
  }
}

//  Google Sign-In

// export const googleSignIn = async () => {
//   try {
//     const success = 'appwrite://auth/callback';
//     const failure = 'appwrite://auth/failure';

//     // This automatically opens the browser and starts OAuth flow
//     await account.createOAuth2Session(
//       OAuthProvider.Google, // or just 'google' if enum throws error
//       success,
//       failure
//     );

//     // No need for InAppBrowser or Linking here
//     // Appwrite will handle the redirect
//   } catch (error) {
//     console.log('Google Sign-In failed:', error);
//   }
// };



// --- New database-related functions ---

