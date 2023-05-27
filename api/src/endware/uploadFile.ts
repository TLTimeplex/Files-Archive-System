import { Request, Response } from 'express';
import fs from 'fs';
import db from '../db';
import IDB_Report from '../types/IDB_report';

export const uploadFile = (req: Request, res: Response) => {
  if (!req.params.userID) return res.status(500).send();

  const reportID = req.params.reportID;

  const rawFile = req.body;

  // Check if any required fields are missing
  if(!req.file) {
    return res.status(200).send({ success: false, message: "Missing file" });
  }
  if (!rawFile.id && !req.params.fileID) {
    return res.status(200).send({ success: false, message: "Missing required fields" });
  }

  const fileInfo = req.file as Express.Multer.File;
  const fileID = req.params.fileID || rawFile.id;

  // Check if user is authorized to upload file
  db.pool.getConnection((err, connection) => {
    connection.query("SELECT * FROM `fas_db`.`report` WHERE `id` = ?", [reportID], (err, results: any[]) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(200).send({ success: false, message: "Report doesn't exists" });
      }
      if (results[0].author_id !== parseInt(req.params.userID) /* or not admin */) {
        return res.status(200).send({ success: false, message: "You are not authorized to upload files to this report" });
      }

      // Create report folder if it doesn't exist
      if (!fs.existsSync(`./reports`))
        fs.mkdirSync(`./reports`);


      // TODO: Check also in the database if the report exists
      if (!fs.existsSync(`./reports/${reportID}`) || !fs.existsSync(`./reports/${reportID}/report.json`))
        return res.status(200).send({ success: false, message: "Report doesn't exists" });

      const report = JSON.parse(fs.readFileSync(`./reports/${reportID}/report.json`, 'utf8')) as IDB_Report;

      // Write file to disk
      fs.copyFileSync(fileInfo.path, `./reports/${reportID}/${fileID}`);
      fs.rmSync(fileInfo.path);

      if (!report.fileIDs)
        report.fileIDs = [];

      // Sync with report
      if (report.fileIDs.findIndex((_fileID) => _fileID === fileID) !== -1)
        return res.status(200).send({ success: true, message: "File updated successfully" });

      report.fileIDs.push(fileID);
      fs.writeFileSync(`./reports/${reportID}/report.json`, JSON.stringify(report));

      connection.release();
      return res.status(200).send({ success: true, message: "File uploaded successfully" });
    });
  });


};

export default uploadFile;