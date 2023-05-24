import { Request, Response } from 'express';
import IDB_Report from '../types/IDB_report';
import fs from 'fs';

export const uploadReport = (req: Request, res: Response) => {
  const rawReport = req.body;

  console.log(req.params.userID)

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
    res.status(200).send({ success: false, message: "Report already exists" });
  }
  
  fs.mkdirSync(`./reports/${report.id}`);
  fs.writeFileSync(`./reports/${report.id}/report.json`, JSON.stringify(report));

  res.status(200).send({ success: true, message: "Report uploaded successfully" });

};

export default uploadReport;