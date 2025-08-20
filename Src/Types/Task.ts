    // TaskInput:
export type NewTask = Omit<Task, 'id'>
export type Task = {
    id: number;  
    task: string;  
    timestamp:string,        // or string if you use UUID
    // category?: [string];
    description?: string;
    dueDateTime?: string; // ISO date string
    completed?: boolean;
    isSynced?: boolean; // used to check if the task is synced with the appwrite or not
    success?: (res: any) => void;
    error?: (err: any) => void;
};