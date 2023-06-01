import { Request, Response } from 'express';
import fs from 'fs';
import db from '../../../db';
import { report } from '../../../db/interfaces';
import { toRestrictions } from '../../../types/restrictions';
import path from 'path';
import { API_FileMeta } from '../../../types/API_File';

export const getFileMeta = (req: Request, res: Response) => {
  if (!req.params.reportID) return res.status(500).send();

  const reportID = req.params.reportID;
  const fileID = req.params.fileID;
  const userID = parseInt(req.params.userID);

  if (!fs.existsSync(`./reports/${reportID}/report.json`) || !fs.existsSync(`./reports/${reportID}/${fileID}`) || !fs.existsSync(`./reports/${reportID}/${fileID}.json`))
    return res.status(200).send({ success: false, message: "Report/File/Meta does not exist" });

  const fileMeta = JSON.parse(fs.readFileSync(`./reports/${reportID}/${fileID}.json`, 'utf8')) as API_FileMeta;
  
  db.pool.getConnection((err, connection) => {
    connection.query("SELECT * FROM `fas_db`.`report` WHERE `id` = ?",
      [reportID],
      (err, results: any[]) => {

        if (err) throw err;

        if (results.length !== 1)
          return res.status(200).send({ success: false, message: "Report does not exist" });

        const reportEntry = results[0] as report;

        if (reportEntry.author_id === userID) {
          return res.status(200).send({ success: true, meta: fileMeta});
        }

        if (!reportEntry.restrictions) {
          return res.status(200).send({ success: false, message: "not authorized!" });
        }

        const restrictions = toRestrictions(reportEntry.restrictions);

        if (!restrictions.private || restrictions.whitelist.includes(parseInt(req.params.userID))) {
          return res.status(200).send({ success: true, meta: fileMeta});
        }

        // TODO: If user is ADMIN, return report

        return res.status(200).send({ success: false, message: "not authorized!" });

      });
  });

};

export default getFileMeta;