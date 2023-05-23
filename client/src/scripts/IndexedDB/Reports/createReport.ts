import IDB_Report from "../../../types/IDB_report";
import { v4 } from "uuid";
import InsertReport from "./insertReport";

export const CreateReport = async (title?: string, report?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reportData: IDB_Report = {
      id: v4(),
      title: title,
      report: report,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    InsertReport(reportData).then(() => {resolve(reportData.id)}).catch((e) => {reject(e)});
  });
};

export default CreateReport;