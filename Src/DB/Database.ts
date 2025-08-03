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
import { Task } from '../Types/Task';

const db = SQLite.openDatabase({
    name: 'todolist.db', location: 'default'
}
,()=> { // call backfor success
    console.log('Database created successfully');
}, (error)=>{ // call back for error
    console.log('error'+error);
});

// table creation

export const initDB = () => {
    db.transaction(tx=> {
        tx.executeSql( // HERe below first we create the table then in () we define the columns
            `CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            task TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            );`)
    })
}

// Crud


export const insertTask = ({task,timestamp,success,error}:Task) => {
    db.transaction(tx=>{
        tx.executeSql(
            `INSERT INTO tasks (task, timestamp) VALUES (?, ?)`,[task, timestamp],(_,response) => success?.(response),
            (_,err)=> error?.(err)
        )
    })
}