import { Request, Response } from 'express';
import fs from 'fs';
import db from '../../db';
import { report } from '../../db/interfaces';
import { defaultRestrictions } from '../../types/restrictions';

export const unarchiveReport = (req: Request, res: Response) => {
  if (!req.params.userID) return res.status(500).send();

  const archiveID = req.params.archiveID || req.body.archiveID;

  // Check if any required fields are missing
  if (!archiveID) {
    return res.status(200).send({ success: false, message: "Missing report ID" });
  }

  // Create report folder if it doesn't exist
  if (!fs.existsSync(`./reports`)) {
    fs.mkdirSync(`./reports`);
  }

  // TODO: Check also in the database if the report exists
  if (!fs.existsSync(`./reports/${archiveID}`)) {
    return res.status(200).send({ success: false, message: "Report does not exists" });
  }

  // Sync with database
  db.pool.getConnection((err, connection) => {
    connection.query("SELECT * FROM archive WHERE id = ?", [archiveID], (err, result: any[]) => {
      if (err) return res.status(500).send({ success: false, message: "Internal server error" });
      if (result.length === 0) return res.status(200).send({ success: false, message: "Archived report does not exists" });
      // Check if any required fields are missing
      const report: report = result[0];
      if (!report || !report.id || !report.title || !report.author_id || !report.date_created || !report.date_modified) {
        return res.status(200).send({ success: false, message: "Archived report is broken" });
      }
      // Check if the user is the author of the report
      if (report.author_id !== parseInt(req.params.userID) /** OR NOT ADMIN */) { //TODO: Should he be able to do this?
        return res.status(200).send({ success: false, message: "You are not the author of this report" });
      }
      // Check if the report is already archived
      connection.query("SELECT * FROM report WHERE id = ?", [archiveID], (err, result: any[]) => {
        if (err) return res.status(500).send({ success: false, message: "Internal server error" });
        if (result.length !== 0) return res.status(200).send({ success: false, message: "Report is already unarchive" });
        // Unarchive the report
        connection.query("INSERT INTO report (id, title, description, author_id, date_created, date_modified, restrictions) VALUES (?, ?, ?, ?, ?, ?, ?)", [report.id, report.title, report.description, report.author_id, new Date(report.date_created), new Date(report.date_modified), report.restrictions || JSON.stringify(defaultRestrictions)], (err, result) => {
          if (err) return res.status(500).send({ success: false, message: "Internal server error" });
          // Delete the report
          connection.query("DELETE FROM archive WHERE id = ?", [archiveID], (err, result) => {
            if (err) return res.status(500).send({ success: false, message: "Internal server error" });
            return res.status(200).send({ success: true, message: "Report unarchive successfully" });
          });
        });
      });
    });
  });
};

export default unarchiveReport;