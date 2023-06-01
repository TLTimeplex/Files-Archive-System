import { Request, Response } from 'express';
import IDB_Report from '../../types/IDB_report';
import fs from 'fs';
import db from '../../db';
import { report } from '../../db/interfaces';
import { toRestrictions } from '../../types/restrictions';

export const getReport = (req: Request, res: Response) => {
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

        // Get the real deal
        if (!fs.existsSync(`./reports/${reportID}/report.json`)) {
          return res.status(200).send({ success: false, message: "Report does not exist" });
        }

        const report = JSON.parse(fs.readFileSync(`./reports/${reportID}/report.json`, 'utf8')) as IDB_Report;

        // Check for authorization

        if (reportEntry.author_id === parseInt(req.params.userID)) {
          return res.status(200).send({ success: true, report: report });
        }

        if (!reportEntry.restrictions) {
          return res.status(200).send({ success: false, message: "not authorized!" });
        }

        const restrictions = toRestrictions(reportEntry.restrictions);
        
        if (!restrictions.private || restrictions.whitelist.includes(parseInt(req.params.userID))) {
          return res.status(200).send({ success: true, report: report });
        }

        // TODO: If user is ADMIN, return report

        return res.status(200).send({ success: false, message: "not authorized!" });

      });
  });
};

export default getReport;