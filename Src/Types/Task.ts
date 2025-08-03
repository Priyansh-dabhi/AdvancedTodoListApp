    // TaskInput:
export type Task = {
    id: string;  
    task: string;  
    timestamp:string,        // or string if you use UUID
    title: string;
    category?: [string];
    completed?: boolean;
    date?: string;      // optional, if you want to track when the task was created
    
    success?: (res: any) => void;
    error?: (err: any) => void;
};