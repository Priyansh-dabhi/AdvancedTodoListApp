import { View, Text } from 'react-native'
import React , { createContext, useContext, useState, useEffect, Children, ReactNode } from "react"
import { Task } from '../Types/Task';

type TaskContextType = {
    selectedTask: Task | null;
    setSelectedTask: (task: Task | null) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({children}: {children:ReactNode}) => {
    const [selectedTask,setSelectedTask] = useState<Task | null>(null);
    return (
        <TaskContext.Provider value={{selectedTask, setSelectedTask}}>
            {children}
        </TaskContext.Provider>
    )
}

// Custom hook to use the TaskContext

export const useTaskContext = (): TaskContextType => {
    const context = useContext(TaskContext);
    if(!context){
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};