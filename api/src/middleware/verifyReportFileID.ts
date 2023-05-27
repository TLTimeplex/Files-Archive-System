import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import IDB_Report from '../types/IDB_report';

//Authentication check
export const verifyReportFileID = (req: Request, res: Response, next: NextFunction) => {
  const reportID = req.params.reportID;
  const fileID = req.params.fileID;

  if (!reportID || !fileID)
    return res.status(401).send("No report/file ID provided");

  if (!fs.existsSync(`./reports/${reportID}/${fileID}`) || !fs.existsSync(`./reports/${reportID}/report.json`)) {
    return res.status(200).send({ success: false, message: "Report/File does not exist" });
  }

  const report = JSON.parse(fs.readFileSync(`./reports/${reportID}/report.json`, 'utf8')) as IDB_Report;

  if (!report.fileIDs || !report.fileIDs.includes(fileID)) {
    return res.status(200).send({ success: false, message: "File does not exist" });
  }

  next();
};

export default verifyReportFileID;