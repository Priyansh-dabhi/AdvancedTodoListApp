import React, { createContext, useContext, useState } from 'react';

type TaskSummaryContextType = {
  total: number;
  pending: number;
  completed: number;
};

type TaskSummaryContextValue = {
  stats: TaskSummaryContextType;
  setStats: React.Dispatch<React.SetStateAction<TaskSummaryContextType>>;
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

  return (
    <TaskSummaryContext.Provider value={{ stats, setStats }}>
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