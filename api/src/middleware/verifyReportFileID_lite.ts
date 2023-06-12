import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

//Authentication check
export const verifyReportFileID_lite = (req: Request, res: Response, next: NextFunction) => {
  const reportID = req.params.reportID;
  const fileID = req.params.fileID;

  if (!reportID || !fileID)
    return res.status(401).send("No report/file ID provided");

  if (fs.existsSync(`./reports/${reportID}/${fileID}`)) {
    next();
  }

  return res.status(200).send({ success: false, message: "File does not exist"});

};

export default verifyReportFileID_lite;