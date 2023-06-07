import { Request, Response } from 'express';
import IDB_Report from '../../types/IDB_report';
import fs from 'fs';
import db from '../../db';
import { report } from '../../db/interfaces';
import { toRestrictions } from '../../types/restrictions';

/** TODO: User could set archive prop! */
export const updateReport = (req: Request, res: Response) => {
  if (!req.params.userID) return res.status(500).send();

  const rawReport = req.body;
  const reportID = req.params.reportID || req.body.reportID;
  const userID = parseInt(req.params.userID);

  // Check if any required fields are missing
  if (!rawReport.id || !rawReport.createdAt || !rawReport.updatedAt) {
    return res.status(200).send({ success: false, message: "Missing required fields" });
  }

  // check if optional but required fields are missing
  if (!rawReport.title || !rawReport.report) {
    return res.status(200).send({ success: false, message: "Missing optional but required fields" });
  }

  const report = rawReport as IDB_Report;

  // Create report folder if it doesn't exist
  if (!fs.existsSync(`./reports`)) {
    fs.mkdirSync(`./reports`);
  }

  // TODO: Check also in the database if the report exists
  if (!fs.existsSync(`./reports/${report.id}`)) {
    return res.status(200).send({ success: false, message: "Report doesn't exist" });
  }
  // Sync with database
  db.pool.getConnection((err, connection) => {
    connection.query("SELECT * FROM `fas_db`.`report` WHERE (`id` = ?);", [reportID], (err, results: any[]) => {

      if (err) throw err;
      if (results.length === 0) throw "Report id: " + reportID + " not found in database";

      const reportEntry = results[0] as report;

      const restrictions = toRestrictions(reportEntry.restrictions);
      if (restrictions.archive /* And not admin */) return res.status(200).send({ success: false, message: "Report is archived" });

      const oldReport = JSON.parse(fs.readFileSync(`./reports/${report.id}/report.json`).toString()) as IDB_Report;

      // Check if the user is the author of the report or an admin
      if (oldReport.authorID !== userID /** OR NOT ADMIN */) {
        return res.status(200).send({ success: false, message: "You are not the author of this report" });
      }

      // Overwrite some fields
      report.authorID = oldReport.authorID;
      report.createdAt = oldReport.createdAt;
      report.updatedAt = new Date();

      // Overwrite old report
      const u_newReport = { ...oldReport, ...report };

      const newReport = {
        id: oldReport.id,
        title: u_newReport.title,
        report: u_newReport.report,
        createdAt: oldReport.createdAt,
        updatedAt: u_newReport.updatedAt,
        authorID: oldReport.authorID,
        description: u_newReport.description,
        fileIDs: oldReport.fileIDs,
        restrictions: u_newReport.restrictions
      } as IDB_Report;

      fs.writeFileSync(`./reports/${report.id}/report.json`, JSON.stringify(newReport, undefined, 2));


      connection.query("UPDATE `fas_db`.`report` SET `title` = ?, `description` = ?, `date_modified` = ?, `restrictions` = ? WHERE (`id` = ?);",
        [newReport.title,
        newReport.description ? newReport.description : null,
        new Date(newReport.updatedAt),
        JSON.stringify(toRestrictions(JSON.stringify({ ...(reportEntry.restrictions ? JSON.parse(reportEntry.restrictions) : null), ...(newReport.restrictions ? JSON.parse(newReport.restrictions) : null) }))),
        newReport.id],
        (err, results) => {
          if (err) throw err;
          connection.release();
          return res.status(200).send({ success: true, message: "Report uploaded successfully" });
        });

    });
  });


};

export default updateReport;