import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'db4free.net',
    user: 'fas_user',
    password: 'iZhHis*W^1w17%J6',
    database: 'fas_test_db',
    waitForConnections: true,
    connectionLimit: 10,
});

export default pool;