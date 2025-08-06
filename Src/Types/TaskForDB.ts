    // TaskInput:
export type TaskForDB = {
    id: number;  
    task: string;  
    timestamp:string,        // or string if you use UUID
    category?: [string];
    completed?: boolean;
    date?: string;      // optional, if you want to track when the task was created
    
    success?: (res: any) => void;
    error?: (err: any) => void;
};