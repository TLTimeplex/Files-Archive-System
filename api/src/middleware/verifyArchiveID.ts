import {Request, Response, NextFunction} from 'express';
import db from '../db';

//Authentication check
export const verifyArchiveID = (req: Request, res: Response, next: NextFunction) => {
  const archiveID = req.params.archiveID as string;

  if (!archiveID) return res.status(401).send("No archive ID provided");

  db.pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query('SELECT * FROM archive WHERE id = ?', [archiveID], (err: any, results: any[]) => {
      if (err) throw err;

      if (results.length !== 1) return res.status(200).send({ success: false, message: "Archived report does not exist"});

      connection.release();
      next();
    });
  });
};

export default verifyArchiveID;