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

export const initDB = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                task TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                completed INTEGER DEFAULT 0
            );`
        );
    });
};

// insert
export const insertTask = (task: NewTask) => {
  console.log('Received task in insertTask:', task); // <- Debug
    db.transaction(tx => {
        tx.executeSql(
        `INSERT INTO tasks (task, timestamp, completed) VALUES (?, ?, ?)`,
        [task.task, task.timestamp|| '', task.completed ? 1 : 0],
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


// delete

export const deleteTask = (id: number, success?: () => void, error?: (err: any) => void) => {
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
export const updateTaskCompletion = ({ id, completed, success, error }: UpdateTaskCompletionParams) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE tasks SET completed = ? WHERE id = ?`,
            [completed ? 1 : 0, id],
            () => {
                console.log("Task completion updated");
                success?.();
            },
            (_, err) => {
                console.log("Error updating completion:", err);
                error?.(err);
                return false;
            }
        );
    });
};

// get all tasks

export const getAllTasks = (callback: (tasks: any[]) => void) => {
    db.transaction(tx => {
        tx.executeSql(
            `SELECT * FROM tasks ORDER BY id DESC`,
            [],
            (_, { rows }) => {
                const tasksArray = [];
                for (let i = 0; i < rows.length; i++) {
                    tasksArray.push(rows.item(i));
                }
                callback(tasksArray);
            }
        );
    });
};