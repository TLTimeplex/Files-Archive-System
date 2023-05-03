import {Request, Response} from 'express';
import db from '../db';
import { users } from '../db/interfaces';
import bcrypt from 'bcrypt';
import { v4 as uuid_v4 } from 'uuid';

export const loginUser = (req : Request, res : Response) => {
  
  const username = req.params.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).send("Invalid username or password");
  }

  // Open connection
  db.pool.getConnection((err, connection) => {
    if (err) throw err;

    // Check if user exists
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err : any, results : any[]) => {
      if(err) throw err;

      if(results.length !== 1) return res.status(200).send("Invalid username or password");
      const user = results[0] as users;

      // Check if password is correct
      bcrypt.compare(password, user.password, (err, same) => {
        if(err) throw err;

        if(!same) return res.status(200).send("Invalid username or password");
        
        // Generate token
        const uuid = uuid_v4();

        // Save token in database and as cookie
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

        res.cookie('token', uuid, { expires: expires, path: '/', });

        connection.query("INSERT INTO `fas_db`.`session` (`token`, `user_id`, `date_created`, `date_expires`) VALUES (?, ?, ?, ?)"
        , [uuid, user.id, new Date(Date.now()), expires], (err : any, results : any[]) => {
          if(err) throw err;
        });

        // Return token
        return res.status(200).send(uuid);
      });
    });
  });
};