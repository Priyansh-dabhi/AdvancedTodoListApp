    // TaskInput:
export type NewTask = Omit<Task, 'id'>
export type Task = {
    id: string;  
    task: string;  
    timestamp:string,        // or string if you use UUID
    // category?: [string];
    description?: string;
    dueDateTime?: string | null; // ISO date string
    completed?: boolean;
    isSynced?: boolean; // used to check if the task is synced with the appwrite or not
    userId: string;
    photoId?: string | null; // stores the Appwrite File ID
    photoPath?: string | null; // stores the local device path to the image
    isDeleted?: boolean;
    success?: (res: any) => void;
    error?: (err: any) => void;
};