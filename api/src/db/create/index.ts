import { Pool } from "mysql2";
import { DB_VERSION } from "..";

export function createScheme(db : Pool){
  db.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      return;
    }

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
        }
      }
    );
    
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
        }
      }
    );

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
      }
      }
    );

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
      }
      }
    );

    connection.query(`
    CREATE TABLE IF NOT EXISTS report (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      author_id INT NOT NULL,
      path VARCHAR(255) NOT NULL,
      date_created DATETIME NOT NULL,
      date_modified DATETIME NOT NULL,
      restrictions TEXT,
      PRIMARY KEY (id),
      FOREIGN KEY (author_id) REFERENCES users(id)
    );
    `, (err, results, fields) => {
      if (err) {
        console.error(err);
      }
      }
    );

    connection.query(`    
    CREATE TABLE IF NOT EXISTS info (
      p_key VARCHAR(255) NOT NULL,
      p_value TEXT,
      PRIMARY KEY (p_key)
    );
    `, (err, results, fields) => {
      if (err) {
        console.error(err);
      }
      }
    );

    //config
    connection.execute(`
    INSERT INTO info (p_key, p_value) VALUES ('version', ?);
    `, [DB_VERSION.toString()], (err, results, fields) => {
      if(err) console.error(err);
    });

    connection.execute(`COMMIT;`);
    connection.release();
  });
} 