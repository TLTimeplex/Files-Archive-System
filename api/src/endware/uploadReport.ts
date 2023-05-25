import { Request, Response } from 'express';
import IDB_Report from '../types/IDB_report';
import fs from 'fs';
import db from '../db';

export const uploadReport = (req: Request, res: Response) => {
  const rawReport = req.body;

  // Check if any required fields are missing
  if (!rawReport.id || !rawReport.createdAt || !rawReport.updatedAt) {
    return res.status(200).send({ success: false, message: "Missing required fields" });
  }

  // check if optional but required fields are missing
  if (!rawReport.title || !rawReport.report) {
    return res.status(200).send({ success: false, message: "Missing optional but required fields" });
  }

  const report = rawReport as IDB_Report;

  report.authorID = parseInt(req.params.userID);

  // Create report folder if it doesn't exist
  if (!fs.existsSync(`./reports`)) {
    fs.mkdirSync(`./reports`);
  }

  if (fs.existsSync(`./reports/${report.id}`)) {
    return res.status(200).send({ success: false, message: "Report already exists" });
  }
  
  fs.mkdirSync(`./reports/${report.id}`);
  fs.writeFileSync(`./reports/${report.id}/report.json`, JSON.stringify(report));

  // Sync with database
  db.pool.getConnection((err, connection) => {
    connection.query("INSERT INTO `fas_db`.`report` (`id`, `title`, `description`, `author_id`, `date_created`, `date_modified`, `restrictions`) VALUES (?, ?, ?, ?, ?, ?, ?)", 
    [report.id, report.title, report.description ? report.description : null, report.authorID, new Date(report.createdAt), new Date(report.updatedAt), JSON.stringify({private: true})], 
    (err, results) => {
      if(err) throw err;
      connection.release();
    });
  });

  return res.status(200).send({ success: true, message: "Report uploaded successfully" });

};

export default uploadReport;