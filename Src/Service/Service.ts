// import { Linking } from 'react-native';
// import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Client, Account, ID, Databases, Storage, Query,  } from 'appwrite';
import { useEffect,useState } from 'react';
import { Platform } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { OAuthProvider } from 'appwrite';
import {APPWRITE_ENDPOINT,APPWRITE_PROJECT_ID,APPWRITE_DATABASE_ID,APPWRITE_COLLECTION_ID,APPWRITE_BUCKET_ID} from '@env';

// console.log('Endpoint:', `'${APPWRITE_ENDPOINT}'`, 'Length:', APPWRITE_ENDPOINT.length);
// console.log('Project ID:', `'${APPWRITE_PROJECT_ID}'`, 'Length:', APPWRITE_PROJECT_ID.length);

export const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT.trim()) 
  .setProject(APPWRITE_PROJECT_ID.trim());

  // setting platform for Appwrite client
// switch (Platform.OS) {
//   case 'android':
//     client.setPlat // Use only on Android emulators, not in production
//     break;
//   // case 'ios':
//   //   // iOS-specific settings if needed
//   //   break;
//   // case 'web':
//   //   // Web-specific settings if needed
//   //   break;
//   default:
//     break;
// }
  // Authentication
  // instance of Account class which provides below methods
export const account = new Account(client);
export const databases = new Databases(client);
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
    console.log('Current User:', user.$id,user.email);
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

export const DATABASE_ID = APPWRITE_DATABASE_ID.trim();
export const COLLECTION_ID = APPWRITE_COLLECTION_ID.trim();

console.log('DB_ID:', `'${APPWRITE_DATABASE_ID}'`, 'Length:', APPWRITE_DATABASE_ID.length);
console.log('COLLECTION ID:', `'${APPWRITE_COLLECTION_ID}'`, 'Length:', APPWRITE_COLLECTION_ID.length);
console.log('Bucket ID:', `'${APPWRITE_BUCKET_ID}'`, 'Length:', APPWRITE_BUCKET_ID.length);

const storage = new Storage(client);



// Add Task
export const addTask = async (taskData: {
  task: string;
  description: string;
  dueDateTime: string;
  completed: boolean;
  timestamp: string;
  userId: string;
}) => {
  try {
    // console.log("DB ID:", DATABASE_ID);
    // console.log("Collection ID:", COLLECTION_ID);
    const res = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      taskData
    );
    return res; // return the created document
  } catch (error) {
    console.error("Appwrite addTask error:", error);
    throw error; // let UI handle the error
  }
};

// Update Task
export async function updateTaskFromAppwrite(docId: string, taskData: Partial<typeof addTask>) {
  return await databases.updateDocument(
    DATABASE_ID,
    COLLECTION_ID,
    docId,
    taskData
  );
}

// Delete Task
export async function deleteTaskFromAppwrite(docId: string) {
  return await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, docId);
}

// Get All Tasks for User
export const getTasks = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal('userId', userId) 
      ]
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
};


// helper function to upload image to Appwrite Storage [we are using MIME type to determine the file type]

// export const uploadImage = async (fileUri: string) => {
//   try{
//         const fileId:string = ID.unique();

//     // Get the file type from the URI's extension
//         let fileType = 'image/jpeg'; // Default to JPEG
//         if (fileUri.endsWith('.png')) {
//             fileType = 'image/png';
//         } else if (fileUri.endsWith('.gif')) {
//             fileType = 'image/gif';
//         }else if (fileUri.endsWith('.jpg')) {
//             fileType = 'image/jpg';
//         }

//         // The file object now has the correct MIME type
//         const fileToUpload = {
//           uri: fileUri,
//           // name: `${fileId}.jpg`,
//           name: fileId,
//           type: fileType,
//         }as any;
//         const response =  await storage.createFile(
//             APPWRITE_BUCKET_ID,
//             fileId,
//             fileToUpload
//         );
//         const fileUrl = storage.getFileView(APPWRITE_BUCKET_ID,response.$id);
//   }catch (error) {
//         console.error('Error uploading image:', error);
//         Snackbar.show({
//             text: 'Failed to upload photo.',
//             duration: Snackbar.LENGTH_SHORT,
//         });
//         return null;
//     }
// }

// A new function in your service file

// const syncData = async () => {
//     // 1. Get all tasks that have not been synced
//     const unsyncedTasks = await getUnsyncedTasks(); // You'll need to write this function
    
//     if (unsyncedTasks && unsyncedTasks.length > 0) {
//         console.log(`Found ${unsyncedTasks.length} tasks to sync.`);
        
//         for (const task of unsyncedTasks) {
//             try {
//                 // 2. Upload the task to Appwrite
//                 const response = await createTaskInAppwrite(task);
                
//                 if (response) {
//                     // 3. On successful upload, mark the task as synced in the local database
//                     await updateTaskSyncStatusInLocalDB(task.id, true);
//                 }
//             } catch (error) {
//                 console.error(`Failed to sync task ${task.id}:`, error);
//                 // Handle what happens if sync fails (e.g., retry later)
//             }
//         }
        
//         // After syncing, refresh the UI
//         fetchTask();
//     }
// };