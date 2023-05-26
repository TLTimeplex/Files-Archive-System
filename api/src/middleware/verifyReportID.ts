import {Request, Response, NextFunction} from 'express';
import db from '../db';
import { session } from '../db/interfaces';

//Authentication check
export const verifyReportID = (req: Request, res: Response, next: NextFunction) => {
  const reportID = req.params.reportID as string;

  if (!reportID) return res.status(401).send("No report ID provided");

  db.pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query('SELECT * FROM report WHERE id = ?', [reportID], (err: any, results: any[]) => {
      if (err) throw err;

      if (results.length !== 1) return res.status(200).send({ success: false, message: "Report does not exist"});

      connection.release();
      next();
    });
  });
};

export default verifyReportID;