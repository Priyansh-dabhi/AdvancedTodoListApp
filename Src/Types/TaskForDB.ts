    // TaskInput:
export type TaskForDB = {
    id: string;  
    task: string;  
    timestamp:string,        // or string if you use UUID
    success?: (res: any) => void;
    error?: (err: any) => void;
};