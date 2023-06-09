import IDB_Report from "../../../types/IDB_report";
import { v4 } from "uuid";
import InsertReport from "./insertReport";

/**
 * This function creates a new report in the database as local only.
 * @param title 
 * @param report 
 * @returns 
 */
export const CreateReport = async (title?: string, report?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reportData: IDB_Report = {
      id: v4(),
      title: title,
      report: report,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    InsertReport(reportData, "local").then(() => {resolve(reportData.id)}).catch((e) => {reject(e)});
  });
};

export default CreateReport;