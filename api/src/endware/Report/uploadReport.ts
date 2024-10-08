import { Request, Response } from 'express';
import IDB_Report from '../../types/IDB_report';
import fs from 'fs';
import db from '../../db';
import { defaultRestrictions } from '../../types/restrictions';

export const uploadReport = (req: Request, res: Response) => {
  if (!req.params.userID) return res.status(500).send();

  const rawReport = req.body;

  // Check if any required fields are missing
  if (!rawReport.id || !rawReport.createdAt || !rawReport.updatedAt) {
    return res.status(200).send({ success: false, message: "Missing required fields" });
  }

  // check if optional but required fields are missing
  if (!rawReport.title || !rawReport.report) {
    return res.status(200).send({ success: false, message: "Missing optional but required fields" });
  }

  const U_rawReport = rawReport as IDB_Report;

  // Sieve out the fields that are not allowed to be changed
  const report : IDB_Report = {
    id: req.params.reportID || U_rawReport.id,
    title: U_rawReport.title,
    report: U_rawReport.report,
    createdAt: U_rawReport.createdAt,
    updatedAt: new Date(),
    authorID: parseInt(req.params.userID),
    description: U_rawReport.description,
    fileIDs: [],
  };

  // Create report folder if it doesn't exist
  if (!fs.existsSync(`./reports`)) {
    fs.mkdirSync(`./reports`);
  }

  // TODO: Check also in the database if the report exists
  if (fs.existsSync(`./reports/${report.id}`)) {
    return res.status(200).send({ success: false, message: "Report already exists" });
  }

  fs.mkdirSync(`./reports/${report.id}`);
  fs.writeFileSync(`./reports/${report.id}/report.json`, JSON.stringify(report));

  // Sync with database
  db.pool.getConnection((err, connection) => {
    connection.query("INSERT INTO `fas_db`.`report` (`id`, `title`, `description`, `author_id`, `date_created`, `date_modified`, `restrictions`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [report.id, report.title, report.description ? report.description : null, report.authorID, new Date(report.createdAt), new Date(report.updatedAt), JSON.stringify(defaultRestrictions)],
      (err, results) => {
        connection.release();
        if (err) throw err;
      });
  });

  return res.status(200).send({ success: true, message: "Report uploaded successfully" });

};

export default uploadReport;