import mysql from 'mysql2';
import { createScheme } from './create';
import Version from '../version';

export const DB_VERSION: Version = new Version('1.2.0');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'fas_user',
  database: 'fas_db',
  connectionLimit: 100,
});

async function autoInit(): Promise<void> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      //Check if table info exists, if not create scheme
      connection.query(`SHOW TABLES LIKE 'info';`, (err: any, results: mysql.RowDataPacket[]) => {
        if (err) {

          console.error(err);
          reject(err);
          return;
        }

        const checkingScheme: Promise<boolean> = new Promise((resolve, reject) => {
          if (results.length === 0) {
            console.log('Creating scheme...');
            createScheme(pool).then(() => {
              console.log('Scheme created');
              resolve(true);
              console.log({ currentVersion: DB_VERSION.toString() })
            });
          }
          else {
            resolve(false);
          }
        });

        checkingScheme.then((result) => {
          if (result) {
            connection.release();
            resolve();
            return;
          }
          //Get version from info table
          connection.query(`SELECT p_value FROM info WHERE p_key = 'version';`, (err: any, results: any[]) => {
            if (err) {
              console.error(err);
              reject(err);
              return;
            }

            if (results.length === 0) {
              console.log('No version found, creating version entry...');
              createScheme(pool);
              console.log('Version entry created');
              return;
            }

            const version = new Version(results[0].p_value);

            if (Version.greaterThan(DB_VERSION, version)) {
              console.log({ oldVersion: results[0].p_value });
              console.log('Updating database...');
              // TODO: Update Scheme script
              createScheme(pool);
              console.log('Database updated');
            }

            console.log({ currentVersion: DB_VERSION.toString() });
            connection.release();
            resolve();
          });
        });
      });
    });
  });
}

export default { pool, autoInit };