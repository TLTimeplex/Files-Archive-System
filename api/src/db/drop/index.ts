import { Pool } from "mysql2";

export function dropScheme(db : Pool){
  db.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      return;
    }

    connection.query(`
    DROP TABLE IF EXISTS user_group;
    `,
      (err, results, fields) => {
        if (err) {
          console.error(err);
        }
        connection.release();
      }
    );
    
    connection.query(`
    DROP TABLE IF EXISTS usergroups;
    `,
      (err, results, fields) => {
        if (err) {
          console.error(err);
        }
        connection.release();
      }
    );

    connection.query(`
    DROP TABLE IF EXISTS session;
    `, (err, results, fields) => {
      if (err) {
        console.error(err);
      }
      connection.release();
      }
    );

    connection.query(`
    DROP TABLE IF EXISTS file;
    `, (err, results, fields) => {
      if (err) {
        console.error(err);
      }
      connection.release();
      }
    );

    connection.query(`
    DROP TABLE IF EXISTS users;
    `, (err, results, fields) => {
      if (err) {
        console.error(err);
      }
      connection.release();
      }
    );

    connection.query(`
    DROP TABLE IF EXISTS settings;
    `, (err, results, fields) => {
      if (err) {
        console.error(err);
      }
      connection.release();
      }
    );

    connection.query(`
    DROP TABLE IF EXISTS info;
    `, (err, results, fields) => {
      if (err) {
        console.error(err);
      }
      connection.release();
      }
    );

  });
}