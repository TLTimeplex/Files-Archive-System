import { Request, Response } from 'express';
import fs from 'fs';
import db from '../../../db';
import { report } from '../../../db/interfaces';
import { toRestrictions } from '../../../types/restrictions';
import path from 'path';

export const getFile = (req: Request, res: Response) => {
  if (!req.params.reportID) return res.status(500).send();

  const reportID = req.params.reportID;
  const fileID = req.params.fileID;
  const userID = parseInt(req.params.userID);

  if (!fs.existsSync(`./reports/${reportID}/report.json`) || !fs.existsSync(`./reports/${reportID}/${fileID}`))
    return res.status(200).send({ success: false, message: "Report/File does not exist" });

  db.pool.getConnection((err, connection) => {
    connection.query("SELECT * FROM `fas_db`.`report` WHERE `id` = ?",
      [reportID],
      (err, results: any[]) => {
        connection.release();

        if (err) throw err;


        if (results.length !== 1)
          return res.status(200).send({ success: false, message: "Report does not exist" });

        const reportEntry = results[0] as report;

        if (reportEntry.author_id === userID) {
          return res.status(200).sendFile(path.resolve(`./reports/${reportID}/${fileID}`));
        }

        if (!reportEntry.restrictions) {
          return res.status(200).send({ success: false, message: "not authorized!" });
        }

        const restrictions = toRestrictions(reportEntry.restrictions);

        if (!restrictions.private || restrictions.whitelist.includes(parseInt(req.params.userID))) {
          return res.status(200).sendFile(path.resolve(`./reports/${reportID}/${fileID}`));
        }

        // TODO: If user is ADMIN, return report

        return res.status(200).send({ success: false, message: "not authorized!" });

      });
  });

};

export default getFile;