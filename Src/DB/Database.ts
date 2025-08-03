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

import SQLite from 'react-native-sqlite-storage'
import { TaskForDB } from '../Types/TaskForDB';

const db = SQLite.openDatabase({
    name: 'todolist.db', location: 'default'
}
,()=> { // call backfor success
    console.log('Database created successfully');
}, (error)=>{ // call back for error
    console.log('error'+error);
});


// Crud

// table creation

export const initDB = () => {
    db.transaction(tx=> {
        tx.executeSql( // HERe below first we create the table then in () we define the columns
            `CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            task TEXT NOT NULL,
            timestamp TEXT NOT NULL
            );`)
    })
}


// insert
export const insertTask = ({task,timestamp,success,error}:TaskForDB) => {
    db.transaction(tx=>{
        tx.executeSql(
            `INSERT INTO tasks (task, timestamp) VALUES (?, ?)`,[task, timestamp],(_,response) => success?.(response),
            (_,err)=> {
                error?.(err)
                console.log('Error inserting task:', err);
                return true;
            }
        )
    })
}

// delete

export const deleteTask = ({ id, success, error }: TaskForDB) => {
    db.transaction(tx => {
        tx.executeSql(
        `DELETE FROM tasks WHERE id = ?`,
        [id],
        (_, response) => success?.(response),
        (_, err) => error?.(err)
        );
    });
};

// update
export const updateTask = ({id,task,timestamp,success,error}: TaskForDB) => {
    db.transaction(tx => {
        tx.executeSql(
        `UPDATE tasks SET task = ?, timestamp = ? WHERE id = ?`,
        [task, timestamp, id],
        (_, response) => success?.(response),
        (_, err) => error?.(err)
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
        },
        (_, err) => {
            console.error('Error fetching tasks:', err);
            return true;
        }
    );
    });
};
