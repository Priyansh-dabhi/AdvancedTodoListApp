import { 
  Client, 
  Account, 
  ID, 
  TablesDB, 
  Storage, 
  Query, 
  OAuthProvider,

} from 'appwrite';
import { Platform } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { 
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
  APPWRITE_BUCKET_ID
} from '@env';
import RNFS from 'react-native-fs';

// ---------------------
// CLIENT SETUP
// ---------------------
export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT.trim())
  .setProject(APPWRITE_PROJECT_ID.trim());

// ---------------------
// APPWRITE SERVICES
// ---------------------
export const account = new Account(client);
export const tables = new TablesDB(client);
export const storage = new Storage(client);

export const DATABASE_ID = APPWRITE_DATABASE_ID.trim();
export const COLLECTION_ID = APPWRITE_COLLECTION_ID.trim();

// ---------------------
// TYPES
// ---------------------
type CreateUserAccount = {
  name: string;
  email: string;
  password: string;
};
type LoginUser = {
  email: string;
  password: string;
};

// ---------------------
// AUTH FUNCTIONS
// ---------------------

// SignUp
interface NewCreateUserAccount {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const createAccount = async ({ email, password, firstName, lastName }: NewCreateUserAccount) => {
  try {
    // Combine first and last name into Appwrite's `name` field
    const fullName = `${firstName} ${lastName}`;

    const response = await account.create(
      ID.unique(),
      email,
      password,
      fullName
    );

    return response;
  } catch (error) {
    Snackbar.show({ text: String(error), duration: Snackbar.LENGTH_SHORT });
    return null;
  }
};
// Login
export const login = async ({ email, password }: LoginUser) => {
  try {
    const session = await account.createEmailPasswordSession({ email, password });
    return session;
  } catch (error) {
    Snackbar.show({ text: String(error), duration: Snackbar.LENGTH_SHORT });
    return null;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    console.log('Current User:', user.$id, user.email);
    return user;
  } catch (error) {
    Snackbar.show({ text: String(error), duration: Snackbar.LENGTH_SHORT });
    return null;
  }
};

// Logout
export const logout = async () => {
  try {
    await account.deleteSession({ sessionId: 'current' });
    return true;
  } catch (error) {
    Snackbar.show({ text: String(error), duration: Snackbar.LENGTH_SHORT });
    return null;
  }
};

// ---------------------
// TASK FUNCTIONS (Tables API)
// ---------------------

// Add Task
export const addTask = async (taskData: {
  task: string;
  description: string;
  dueDateTime: string | null;
  completed: boolean;
  timestamp: string;
  userId: string;
  photoId: string | null;
  photoPath: string | null;
}) => {
  try {
    const res = await tables.createRow({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      rowId: ID.unique(),
      data: taskData,
    });
    return res;
  } catch (error) {
    console.error("Appwrite addTask error:", error);
    throw error;
  }
};

// Update Task
export async function updateTaskFromAppwrite(docId: string, taskData: any) {
  return await tables.updateRow({
    databaseId: DATABASE_ID,
    tableId: COLLECTION_ID,
    rowId: docId,
    data: taskData,
  });
}

// Delete Task
export async function deleteTaskFromAppwrite(docId: string) {
  return await tables.deleteRow({
    databaseId: DATABASE_ID,
    tableId: COLLECTION_ID,
    rowId: docId,
  });
}

// Get All Tasks for User
export const getTasks = async (userId: string) => {
  try {
    const response = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      queries: [Query.equal('userId', userId)],
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
};

// ---------------------
// STORAGE (Files)
// ---------------------
export async function uploadFile(localFilePath: string) {
  try {
    const stats = await RNFS.stat(localFilePath);
    const fileSize = stats.size;
    const fileName = localFilePath.split('/').pop() || 'unnamed_file.jpg';

    let fileType = 'image/jpeg';
    if (fileName.endsWith('.png')) {
      fileType = 'image/png';
    }

    const file: File = {
      uri: `file://${localFilePath}`,
      name: fileName,
      type: fileType,
      size: fileSize,
      
    }as any;

    console.log('Final file object being sent to Appwrite:', JSON.stringify(file, null, 2));

    const response = await storage.createFile({
      bucketId: APPWRITE_BUCKET_ID,
      fileId: ID.unique(),
      file,
    });

    return response.$id;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}


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