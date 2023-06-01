import mysql from 'mysql2';
import { createScheme } from './create';
import Version from '../version';

export const DB_VERSION: Version = new Version('1.1.0');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'fas_user',
  database: 'fas_db',
  connectionLimit: 100,
});

function autoInit(): boolean {
  pool.getConnection((err, connection) => {
    //Check if table info exists, if not create scheme
    connection.execute(`SHOW TABLES LIKE 'info';`, (err: any, results: mysql.RowDataPacket[]) => {
      if (err) {
        console.error(err);
      }

      if (results.length === 0) {
        console.log('Creating scheme...');
        createScheme(pool);
        console.log('Scheme created');
      }
    });

    //Get version from info table
    connection.execute(`SELECT p_value FROM info WHERE p_key = 'version';`, (err: any, results: any[]) => {
      if (err) {
        console.error(err);
      }

      if (results.length === 0) {
        console.log('No version found, creating version entry...');
        createScheme(pool);
        console.log('Version entry created');
        return;
      }

      const version = new Version(results[0].p_value);

      if (Version.greaterThan(DB_VERSION, version)) {
        console.log('Updating database...');
        // TODO: Update Scheme script
        createScheme(pool);
        console.log('Database updated');
      }

      console.log(results);
    });

    connection.release();

  });
  return true;
}

export default { pool, autoInit };