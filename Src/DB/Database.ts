// import SQLite from 'react-native-sqlite-storage';

// SQLite.enablePromise(true);

// const getDBConnection = async () => {
//     return SQLite.openDatabase({ name: 'tasks.db', location: 'default' });
// };

// const createTables = async (db: SQLite.SQLiteDatabase) => {
//     const query = `
//         CREATE TABLE IF NOT EXISTS tasks (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT NOT NULL,
//         description TEXT,
//         date TEXT,
//         completed INTEGER DEFAULT 0
//         );
//     `;
//     await db.executeSql(query);
// };

// export { getDBConnection, createTables };
import SQLite from 'react-native-sqlite-storage';
import { NewTask, Task } from '../Types/Task'; // Assuming both types are in this file

const db = SQLite.openDatabase({
    name: 'todolist.db',
    location: 'default'
}, () => {
    console.log('Database created successfully');
}, (error) => {
    console.log('error' + error);
});

// Crud
// table creation
// isSynced is used to check if the task is synced with the appwrite or not

export const initDB = () => {
  // This transaction creates the table with the FINAL, correct schema.
  // We've removed dueDate and dueTime, and added dueDateTime.
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY, 
            task TEXT NOT NULL,
            timestamp TEXT,
            description TEXT,
            dueDateTime TEXT, 
            completed INTEGER DEFAULT 0,
            isSynced INTEGER DEFAULT 0
            )`,
            [],
            () => console.log('Database and table are ready.'),
            (_, error) => {
                console.error('Error creating table:', error);
                return true; // Propagate the error
            }
            );
    });

  // This second transaction handles migrations for users who already have the app.
  // It ensures the new columns exist if the table was created with an older schema.
    db.transaction(tx => {
    // Add 'description' column if it doesn't exist
        tx.executeSql(
        `ALTER TABLE tasks ADD COLUMN description TEXT`,
        [],
        () => console.log("Column 'description' added successfully."),
        (_, error) => {
            if (!error.message.includes('duplicate column name')) {
            console.error('Error adding description column:', error);
            }
            return false; // Don't propagate the error
        }
        );

        // Add 'dueDateTime' column if it doesn't exist
        tx.executeSql(
        `ALTER TABLE tasks ADD COLUMN dueDateTime TEXT`,
        [],
        () => console.log("Column 'dueDateTime' added successfully."),
        (_, error) => {
            if (!error.message.includes('duplicate column name')) {
            console.error('Error adding dueDateTime column:', error);
            }
            return false; // Don't propagate the error
        }
        );
    });
};

// insert
export const insertTask = (task: NewTask) => {
  console.log('Received task in insertTask:', task); // <- Debug
    db.transaction(tx => {
        // Updated INSERT statement to use the new `dueDateTime` column
        tx.executeSql(
        `INSERT INTO tasks (task, timestamp, dueDateTime, completed, isSynced) VALUES (?, ?, ?, ?, ?)`,
        [
            task.task,
            task.timestamp || '',
            task.dueDateTime || '', // Use the new single property
            task.completed ? 1 : 0,
            task.isSynced ? 1 : 0,
        ],
        (_, result) => {
            task.success?.(result);
            console.log('Task inserted successfully:', result);
        },
        (_, error) => {
            task.error?.(error);
            return true;
        }
        );
    });
};
// Insert or update task
export const insertOrUpdateTask = (task: Task) => {
    db.transaction(tx => {
        tx.executeSql(
        `INSERT OR REPLACE INTO tasks (id, task, timestamp, description, dueDateTime, completed, isSynced)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            task.id,
            task.task,
            task.timestamp,
            task.description,
            task.dueDateTime,
            task.completed ? 1 : 0,
            task.isSynced ? 1 : 0,
        ]
        );
    });
};

// update
export const updateTask = (
    id: number,
    updatedTask: Partial<Task>,
    success?: () => void,
    error?: (err: any) => void
) => {
    const { task, description, dueDateTime } = updatedTask;
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE tasks SET task = ?, description = ?, dueDateTime = ?, isSynced = 0 WHERE id = ?`,
            [task, description, dueDateTime, id],
            (_, result) => {
                console.log(`Task with id ${id} updated successfully`);
                success?.();
            },
            (_, err) => {
                console.error(`Failed to update task with id ${id}:`, err);
                error?.(err);
                return true; // Propagate the error
            }
        );
    });
};
// delete
export const deleteTask = (
    id: number,
    success?: () => void,
    error?: (err: any) => void
    ) => {
    db.transaction(tx => {
        tx.executeSql(
        'DELETE FROM tasks WHERE id = ?',
        [id],
        (_, result) => {
            console.log(`Deleted task with id: ${id}`);
            success?.();
        },
        (_, err) => {
            console.error(`Failed to delete task with id ${id}:`, err);
            error?.(err);
            return false;
        }
        );
    });
};

// update
export type UpdateTaskCompletionParams = {
    id: number;
    completed: boolean;
    success?: () => void;
    error?: (err: any) => void;
};
export const updateTaskCompletion = ({
    id,
    completed,
    success,
    error,
}: UpdateTaskCompletionParams) => {
    db.transaction(tx => {
    tx.executeSql(
        `UPDATE tasks SET completed = ? WHERE id = ?`,
        [completed ? 1 : 0, id],
        () => {
            console.log('Task completion updated');
            success?.();
        },
        (_, err) => {
            console.log('Error updating completion:', err);
            error?.(err);
            return false;
        }
        );
    });
};

// get all tasks [used in home screen]
export const getAllTasks = (callback: (tasks: any[]) => void) => {
    db.transaction(tx => {
        tx.executeSql(`SELECT * FROM tasks ORDER BY id DESC`, [], (_, { rows }) => {
        const tasksArray = [];
        for (let i = 0; i < rows.length; i++) {
            tasksArray.push(rows.item(i));
        }
        callback(tasksArray);
        });
    });
};

// get all task by id
export const getTaskById = (id: number): Promise<Task | null> => {
    return new Promise(resolve => {
        db.transaction(tx => {
        tx.executeSql(`SELECT * FROM tasks WHERE id = ?`, [id], (_, { rows }) => {
            if (rows.length > 0) {
            resolve(rows.item(0) as Task);
            } else {
            resolve(null);
            }
        });
        });
    });
};

// get unsynced tasks
export const getUnsyncedTasks = (callback: (tasks: Task[]) => void) => {
    db.transaction(tx => {
        tx.executeSql(
        `SELECT * FROM tasks WHERE isSynced = ?`,
        [0],
        (_, { rows }) => {
            const unsyncedTasks = [];
            for (let i = 0; i < rows.length; i++) {
            unsyncedTasks.push(rows.item(i));
            }
            callback(unsyncedTasks);
        }
        );
    });
};

export const updateTaskSyncStatus = (taskId: number) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
        tx.executeSql(
            `UPDATE tasks SET isSynced = 1 WHERE id = ?;`,
            [taskId],
            () => resolve(true),
            (_, error) => reject(error)
        );
        });
    });
};
