// context/SQLiteContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const SQLiteContext = createContext<any>(null);

export const SQLiteProvider = ({ children }: { children: React.ReactNode }) => {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

    useEffect(() => {
        const initDB = async () => {
        try {
            const database = await SQLite.openDatabase({ name: 'tasks.db', location: 'default' });

            await database.executeSql(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                date TEXT,
                completed INTEGER DEFAULT 0
            );
            `);

            setDb(database);
        } catch (error) {
            console.error('SQLite Init Error:', error);
        }
        };

        initDB();

        return () => {
        db?.close();
        };
    }, []);

    return (
        <SQLiteContext.Provider value={{ db }}>
        {children}
        </SQLiteContext.Provider>
    );
};

export const useSQLite = () => useContext(SQLiteContext);
