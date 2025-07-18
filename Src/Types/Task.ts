    // TaskInput:
export type Task = {
    id: number;          // or string if you use UUID
    title: string;
    description?: string;
    completed?: boolean;
};