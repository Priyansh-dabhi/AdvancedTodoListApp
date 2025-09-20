import React, { createContext, useContext, useState } from 'react';
import { Task } from '../Types/Task'; // make sure you have your Task type here

type TaskSummaryContextType = {
  total: number;
  pending: number;
  completed: number;
};

type TaskSummaryContextValue = {
  stats: TaskSummaryContextType;
  updateStats: (tasks: Task[], incrementCompleted?: boolean) => void;
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
const updateStats = (tasks: Task[], incrementCompleted = false) => {
  const total = tasks.length;
  const pending = tasks.filter(task => !task.completed).length;

  setStats(prev => ({
    total,
    pending,
    completed: incrementCompleted ? prev.completed + 1 : prev.completed,
  }));
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
