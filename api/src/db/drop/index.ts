import { Pool } from "mysql2";

export async function dropScheme(db: Pool): Promise<void[]> {
  let promises: Promise<void>[] = [];


  promises.push(new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      promises.push(new Promise((resolve, reject) => {
        connection.query(`
    DROP TABLE IF EXISTS user_group;
    `,
          (err, results, fields) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            resolve();
          }
        );
      }));

      promises.push(new Promise((resolve, reject) => {
        connection.query(`
    DROP TABLE IF EXISTS usergroups;
    `,
          (err, results, fields) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            resolve();
          }
        );
      }));

      promises.push(new Promise((resolve, reject) => {
        connection.query(`
    DROP TABLE IF EXISTS session;
    `, (err, results, fields) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        }
        );
      }));

      promises.push(new Promise((resolve, reject) => {
        connection.query(`
    DROP TABLE IF EXISTS report;
    `, (err, results, fields) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        }
        );
      }));

      promises.push(new Promise((resolve, reject) => {
        connection.query(`
    DROP TABLE IF EXISTS archive;
    `, (err, results, fields) => {

          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        }
        );
      }));

      promises.push(new Promise((resolve, reject) => {
        connection.query(`
    DROP TABLE IF EXISTS users;
    `, (err, results, fields) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        }
        );
      }));

      promises.push(new Promise((resolve, reject) => {
        connection.query(`
    DROP TABLE IF EXISTS settings;
    `, (err, results, fields) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        }
        );
      }));

      promises.push(new Promise((resolve, reject) => {
        connection.query(`
    DROP TABLE IF EXISTS info;
    `, (err, results, fields) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        }
        );
      }));

      resolve();
      connection.release();
    });
  }));

  return Promise.all(promises);
}