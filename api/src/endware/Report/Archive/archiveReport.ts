import { Request, Response } from 'express';
import fs from 'fs';
import db from '../../../db';
import { report } from '../../../db/interfaces';
import { toRestrictions } from '../../../types/restrictions';

export const archiveReport = (req: Request, res: Response) => {
  if (!req.params.userID) return res.status(500).send();

  const reportID = req.params.reportID || req.body.reportID;
  const userID = parseInt(req.params.userID);

  // Check if any required fields are missing
  if (!reportID) {
    return res.status(200).send({ success: false, message: "Missing report ID" });
  }

  // Create report folder if it doesn't exist
  if (!fs.existsSync(`./reports`)) {
    fs.mkdirSync(`./reports`);
  }

  // TODO: Check also in the database if the report exists
  if (!fs.existsSync(`./reports/${reportID}`)) {
    return res.status(200).send({ success: false, message: "Report does not exists" });
  }

  // Sync with database
  db.pool.getConnection((err, connection) => {
    connection.query("SELECT * FROM report WHERE id = ?", [reportID], (err, result: any[]) => {
      if (err) {
        connection.release();
        return res.status(500).send({ success: false, message: "Internal server error" });
      }
      if (result.length === 0) {
        connection.release();
        return res.status(200).send({ success: false, message: "Report does not exists" });
      }
      // Check if any required fields are missing
      const report: report = result[0];
      if (!report || !report.id || !report.title || !report.author_id || !report.date_created || !report.date_modified) {
        connection.release();
        return res.status(200).send({ success: false, message: "Report is broken" });
      }
      // Check if the user is the author of the report
      if (report.author_id !== userID /** OR NOT ADMIN */) {
        connection.release();
        return res.status(200).send({ success: false, message: "You are not the author of this report" });
      }
      let restrictions = toRestrictions(report.restrictions);
      if (restrictions.archive) {
        connection.release();
        return res.status(200).send({ success: false, message: "Report is already archived" });
      }
      restrictions.archive = true;
      restrictions.private = false;
      report.restrictions = JSON.stringify(restrictions);
      // Update the report entry
      connection.query("UPDATE report SET restrictions = ? WHERE id = ?", [report.restrictions, report.id], (err, result) => {
        connection.release();
        if (err) return res.status(500).send({ success: false, message: "Internal server error" });
        return res.status(200).send({ success: true, message: "Report archived successfully" });
      });
    });
  });
};

export default archiveReport;