    // TaskInput:
export type Task = {
    id: string;          // or string if you use UUID
    title: string;
    category?: [string];
    completed?: boolean;
};