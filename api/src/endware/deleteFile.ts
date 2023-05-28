import { Request, Response } from 'express';
import fs from 'fs';
import db from '../db';
import { report } from '../db/interfaces';
import IDB_Report from '../types/IDB_report';

export const deleteReport = (req: Request, res: Response) => {
  if (!req.params.reportID) return res.status(500).send();

  const reportID = req.params.reportID;
  const fileID = req.params.fileID;
  const userID = parseInt(req.params.userID);

  // Check if the report and file exist
  if (!fs.existsSync(`./reports/${reportID}`) || !fs.existsSync(`./reports/${reportID}/${fileID}`)) {
    return res.status(200).send({ success: false, message: "Report/File does not exist" });
  }

  const report = JSON.parse(fs.readFileSync(`./reports/${reportID}/report.json`, { encoding: 'utf-8' })) as IDB_Report;

  db.pool.getConnection((err, connection) => {
    connection.query("SELECT * FROM `fas_db`.`report` WHERE `id` = ?",
      [reportID],
      (err, results: any[]) => {
        if (err) throw err;
        connection.release();

        if (results.length !== 1) return res.status(200).send({ success: false, message: "Report does not exist" });

        const reportEntry = results[0] as report;

        // Check for authorization
        if (reportEntry.author_id !== userID /*&& !req.user.isAdmin*/) {
          return res.status(200).send({ success: false, message: "not authorized!" });
        }

        // Delete the file
        fs.rmSync(`./reports/${reportID}/${fileID}`);

        if(!report.fileIDs)
          report.fileIDs = [];

        // Delete the entry in the report
        report.fileIDs = report.fileIDs.filter((id) => id !== fileID);

        // Update the report
        fs.writeFileSync(`./reports/${reportID}/report.json`, JSON.stringify(report, undefined, 2));


        return res.status(200).send({ success: true, message: "File deleted!" });

      });
  });
};

export default deleteReport;