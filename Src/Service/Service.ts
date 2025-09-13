import { 
  Client, 
  Account, 
  ID, 
  TablesDB, 
  Storage, 
  Query, 
  OAuthProvider,
  Messaging,
  Databases,
  
} from 'appwrite';
import { Platform, Linking } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { 
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
  APPWRITE_COLLECTION_ID_FCM,
  APPWRITE_BUCKET_ID,
  APPWRITE_COLLECTION_ID_USER_AVATAR,
} from '@env';
import RNFS from 'react-native-fs';
import { deleteTaskById, getUnsyncedTasksAsync, insertOrUpdateTask, permanentlyDeleteTask } from '../DB/Database';
import { Task } from '../Types/Task';

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

    const response = await account.create({
        userId: ID.unique(),
        email,
        password,
        name: fullName,
    });

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

// Google Auth


export const loginWithGoogle = async () => {
  try {
    const redirectUrl = 'appwrite-callback-taskmanager://auth'; // MUST match AndroidManifest + iOS Info.plist

    const oauthUrl = `${client.config.endpoint}/account/sessions/oauth2/google?success=${encodeURIComponent(
      redirectUrl
    )}&failure=${encodeURIComponent(redirectUrl)}`;

    await Linking.openURL(oauthUrl);
  } catch (error) {
    console.error('Google login error:', error);
    Snackbar.show({
      text: 'Could not start Google login',
      duration: Snackbar.LENGTH_SHORT,
    });
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
    console.error("❌ Appwrite addTask error:", JSON.stringify(error));
    throw error; // make sure syncOfflineTasks can catch it}
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

const AVATAR_ID = APPWRITE_COLLECTION_ID_USER_AVATAR.trim();
console.log("Avatar ID: "+AVATAR_ID)
export const storeUserAvatar = async (userId: string, avatarFileId: string | null) => {
  try{
      const response = await tables.createRow({
        databaseId: DATABASE_ID,
        tableId: AVATAR_ID,
        rowId: ID.unique(),
        data:{
          userId,
          avatarFileId,
        }
      });
      return response;
  }catch(error){
    console.error("Error storing user avatar:", error);
    throw error;
  }
};


// ---------------------
// STORAGE (Files)
// ---------------------
// export async function uploadFile(localFilePath: string) {
//   try {
//     const stats = await RNFS.stat(localFilePath);
//     const fileSize = stats.size;
//     const fileName = localFilePath.split('/').pop() || 'unnamed_file.jpg';

//     let fileType = 'image/jpeg';
//     if (fileName.endsWith('.png')) {
//       fileType = 'image/png';
//     }

//     const file: File = {
//       uri: `file://${localFilePath}`,
//       name: fileName,
//       type: fileType,
//       size: fileSize,
      
//     }as any;

//     console.log('Final file object being sent to Appwrite:', JSON.stringify(file, null, 2));

//     const response = await storage.createFile({
//       bucketId: APPWRITE_BUCKET_ID,
//       fileId: ID.unique(),
//       file,
//     });

//     return response.$id;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     throw error;
//   }
// }


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

// Notifications [send tokens to appwrite]

// // Function to register device with Appwrite
// export async function registerDeviceWithAppwrite(token: string) {
  //   try {
    //     const result = await messagingService.createDevice({
      //       targetId: 'AdvancedTodoList_FCM', // The provider name you created in Appwrite
      //       deviceId: token, // FCM token from Step 1
      //       type: 'fcm',
      //     });
      
      //     console.log('Device registered with Appwrite:', result);
      //   } catch (error) {
        //     console.error('Error registering device:', error);
        //   }
        // }
const messagingService = new Messaging(client);

const databases = new Databases(client);
const COLLECTION_ID_FCM = APPWRITE_COLLECTION_ID_FCM.trim();
console.log("FCM Collection ID:", COLLECTION_ID_FCM);
// export async function saveToken(userId: string, fcmToken: string) {
//   try {
//     const res = await tables.createRow({
//       databaseId: DATABASE_ID,
//       tableId: COLLECTION_ID_FCM,
//       rowId: ID.unique(),
//       data: {
//         userId,
//         fcmToken,
//       },
//     });

//     return res;
//   } catch (error) {
//     console.error("Appwrite saveToken error:", error);
//     throw error;
//   }
// }
// The Sync Lock: This flag will prevent the function from running multiple times simultaneously.
let isSyncing = false;

export const syncOfflineTasks = async (userId: string) => {
    // 1. Check if a sync is already running. If so, stop immediately.
    if (isSyncing) {
        console.log("🔄 Sync already in progress. Skipping.");
        return;
    }

    // 2. Set the lock to prevent other calls from running.
    isSyncing = true;
    console.log("🟢 Starting sync process...");

    try {
        const offlineTasks = await getUnsyncedTasksAsync();
        if (offlineTasks.length === 0) {
            console.log("👍 No tasks to sync.");
            return; // Exit early if there's nothing to do
        }

        console.log(`Found ${offlineTasks.length} tasks to sync.`);

        for (const localTask of offlineTasks) {
            try {
                const originalLocalId = localTask.id;

                const syncedDoc = await addTask({
                    task: localTask.task ?? "",
                    description: localTask.description ?? "",
                    dueDateTime: localTask.dueDateTime ?? null,
                    completed: Boolean(localTask.completed),
                    timestamp: localTask.timestamp ?? new Date().toISOString(),
                    userId,
                    photoId: localTask.photoId ?? "temp",
                    photoPath: localTask.photoPath ?? null,
                });

                if (syncedDoc?.$id) {
                    await deleteTaskById(originalLocalId);
                    const syncedTask: Task = {
                        ...localTask,
                        id: syncedDoc.$id,
                        isSynced: true,
                    };
                    await insertOrUpdateTask(syncedTask);
                    console.log(`✅ Synced and saved task: ${originalLocalId} -> ${syncedTask.id}`);
                }
            } catch (err) {
                console.error(`❌ Sync failed for local task ${localTask.id}:`, err);
            }
        }
    } catch (error) {
        console.error("❌ An error occurred during the sync process:", error);
    } finally {
        // 3. IMPORTANT: Release the lock so the sync can run again in the future.
        isSyncing = false;
        console.log("🔴 Sync process finished. Lock released.");
    }
};