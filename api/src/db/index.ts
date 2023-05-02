import mysql from 'mysql2';
import { createScheme } from './create';
import Version from '../version';

export const DB_VERSION : Version = new Version('1.0.0');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'fas_user',
    database: 'fas_db',
    waitForConnections: true,
    connectionLimit: 10,
});

function autoInit() : boolean {
    pool.getConnection((err, connection) => {
        //Check if table info exists, if not create scheme
        connection.execute(`SHOW TABLES LIKE 'info';`, (err : any, results : mysql.RowDataPacket[]) => {
            if (err) {
                console.error(err);
            }

            if(results.length === 0){
                console.log('Creating scheme...');
                createScheme(pool);
                console.log('Scheme created');
            }
        });

        //Get version from info table
        connection.execute(`SELECT p_value FROM info WHERE p_key = 'version';`, (err : any, results : mysql.RowDataPacket[]) => {
            if (err) {
                console.error(err);
            }

            console.log(results);
        });



    });
    return true;
}

export default {pool, autoInit};