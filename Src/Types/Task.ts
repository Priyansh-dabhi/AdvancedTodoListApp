    // TaskInput:
export type Task = {
    id: string;          // or string if you use UUID
    title: string;
    category?: [string];
    completed?: boolean;
    date?: string;      // optional, if you want to track when the task was created
};