import {Request, Response, NextFunction} from 'express';
import db from '../db';
import { session } from '../db/interfaces';

//Authentication check
export const verifyToken = (req : Request, res : Response, next : NextFunction) => {
  const token = req.params.token || req.cookies.token;

  if(!token) return res.status(401).send("User is not authorized");

  // Open connection
  db.pool.getConnection((err, connection) => {
    if (err) throw err;

    // Check if token exists
    connection.query('SELECT * FROM session WHERE token = ?', [token], (err : any, results : any[]) => {
      if(err) throw err;

      if(results.length !== 1) return res.status(401).send("User is not authorized");
      const session = results[0] as session;

      // Check if token is expired
      if(session.date_expires < new Date(Date.now())) {
        connection.query('DELETE FROM session WHERE token = ?', [token], (err : any, results : any[]) => {
          if(err) throw err;
          return res.status(401).send("User is not authorized");
        });
      }

      return next();

    });
  });

};