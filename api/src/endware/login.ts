import {Request, Response, NextFunction} from 'express';
import db from '../db';
import { users } from '../db/interfaces';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const loginUser = (req : Request, res : Response) => {
  
  const username = req.params.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).send("Invalid username or password");
  }

  db.pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query('SELECT * FROM users WHERE username = ?', [username], (err : any, results : any[]) => {
      if(err) throw err;

      if(results.length !== 1) return res.status(200).send("Invalid username or password");
      const user = results[0] as users;

      bcrypt.compare(password, user.password, (err, same) => {
        if(err) throw err;

        if(!same) return res.status(200).send("Invalid username or password");
        
        const uuid = uuidv4();
        res.cookie('token', uuid, { expires: new Date(Date.now() + 60 * 60 * 24 * 30), path: '/', });
        return res.status(200).send(uuid);
      });
    });
  });
};