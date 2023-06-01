import { Request, Response } from 'express';
import fs from 'fs';
import db from '../../db';
import { report } from '../../db/interfaces';

export const deleteReport = (req: Request, res: Response) => {
  if (!req.params.reportID) return res.status(500).send();

  const reportID = req.params.reportID;

  db.pool.getConnection((err, connection) => {
    connection.query("SELECT * FROM `fas_db`.`report` WHERE `id` = ?",
      [reportID],
      (err, results: any[]) => {
        if (err) throw err;
        connection.release();

        if (results.length !== 1) return res.status(200).send({ success: false, message: "Report does not exist" });

        const reportEntry = results[0] as report;

        // Check if the real deal exists
        if (!fs.existsSync(`./reports/${reportID}`)) {
          return res.status(200).send({ success: false, message: "Report does not exist" });
        }

        // Check for authorization

        if (reportEntry.author_id !== parseInt(req.params.userID) /*&& !req.user.isAdmin*/) {
          return res.status(200).send({ success: false, message: "not authorized!" });
        }

        // Delete the real deal
        fs.rmSync(`./reports/${reportID}`, { recursive: true });

        // Delete the entry
        db.pool.getConnection((err, connection) => {
          connection.query("DELETE FROM `fas_db`.`report` WHERE `id` = ?",
            [reportID],
            (err, results: any[]) => {
              if (err) throw err;
              connection.release();
              return res.status(200).send({ success: true, message: "Report deleted!" });
            })
        });

      });
  });
};

export default deleteReport;