import React, { createContext, useContext, useState } from 'react';
import { Task } from '../Types/Task'; // make sure you have your Task type here

type TaskSummaryContextType = {
  total: number;
  pending: number;
  completed: number;
};

type TaskSummaryContextValue = {
  stats: TaskSummaryContextType;
  updateStats: (tasks: Task[]) => void;
};

// Create context
export const TaskSummaryContext = createContext<TaskSummaryContextValue | undefined>(undefined);

// Provider component
export const TaskSummaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<TaskSummaryContextType>({
    total: 0,
    completed: 0,
    pending: 0,
  });

  // Centralized function to recalc stats
  const updateStats = (tasks: Task[]) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    setStats({ total, completed, pending });
  };

  return (
    <TaskSummaryContext.Provider value={{ stats, updateStats }}>
      {children}
    </TaskSummaryContext.Provider>
  );
};

// Custom hook
export const useTaskStats = () => {
  const context = useContext(TaskSummaryContext);
  if (!context) throw new Error("useTaskStats must be used within TaskSummaryProvider");
  return context;
};
