import { Pool } from "mysql2";
import { DB_VERSION } from "..";

export async function createScheme(db: Pool): Promise<void[]> {
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
    CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
    );
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
    CREATE TABLE IF NOT EXISTS session (
      token VARCHAR(255) NOT NULL,
      user_id INT NOT NULL,
      date_created DATETIME NOT NULL,
      date_expires DATETIME NOT NULL,
      PRIMARY KEY (token, user_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
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
    CREATE TABLE IF NOT EXISTS usergroups (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      privileges TEXT, 
      PRIMARY KEY (id)
    );
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
    CREATE TABLE IF NOT EXISTS user_group (
      user_id INT NOT NULL,
      group_id INT NOT NULL,
      PRIMARY KEY (user_id, group_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (group_id) REFERENCES usergroups(id)
    );
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
    CREATE TABLE IF NOT EXISTS report (
      id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      author_id INT NOT NULL,
      date_created DATETIME NOT NULL,
      date_modified DATETIME NOT NULL,
      restrictions TEXT,
      PRIMARY KEY (id),
      FOREIGN KEY (author_id) REFERENCES users(id)
    );
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
    CREATE TABLE IF NOT EXISTS info (
      p_key VARCHAR(255) NOT NULL,
      p_value TEXT,
      PRIMARY KEY (p_key)
    );
    `, (err, results, fields) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        }
        );
      }));

      //config
      promises.push(new Promise((resolve, reject) => {
        connection.execute(`
    INSERT INTO info (p_key, p_value) VALUES ('version', ?) ON DUPLICATE KEY UPDATE p_value = ?;
    `, [DB_VERSION.toString(), DB_VERSION.toString()], (err, results, fields) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        });
      }));


      connection.execute(`COMMIT;`);
      connection.release();
      resolve();
    });
  }));

  return Promise.all(promises);
} 