import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const getDBConnection = async () => {
    return SQLite.openDatabase({ name: 'tasks.db', location: 'default' });
};

const createTables = async (db: SQLite.SQLiteDatabase) => {
    const query = `
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT,
        completed INTEGER DEFAULT 0
        );
    `;
    await db.executeSql(query);
};

export { getDBConnection, createTables };
