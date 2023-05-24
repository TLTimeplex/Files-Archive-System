import {Request, Response, NextFunction} from 'express';
import db from '../db';
import { session } from '../db/interfaces';

//Authentication check
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.params.token || req.cookies.token as string;

  if (!token) return res.status(401).send("User is not authorized");

  db.pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query('SELECT * FROM session WHERE token = ?', [token], (err: any, results: any[]) => {
      if (err) throw err;

      if (results.length !== 1) return res.status(401).send("User is not authorized");
      const session = results[0] as session;
      req.params.userID = session.user_id.toString();

      if (session.date_expires < new Date()) {
        connection.query('DELETE FROM session WHERE token = ?', [token], (err: any, results: any[]) => {
          if (err) throw err;
          res.status(401).send("User session has expired"); // Send response here

          connection.release(); // Release connection

          return; // Terminate the function here, as response is already sent
        });
      } else {
        connection.release(); // Release connection
        return next(); // Proceed to the next middleware
      }
    });
  });
};