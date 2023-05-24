import IDB_File from "../../../../../types/iDB_file";
import GetIDB from "../../getIDB";

export const ByReportID = async (reportID: string): Promise<IDB_File[]> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;
      const transaction = db.transaction("files", "readonly");
      const objectStore = transaction.objectStore("files");

      const request = objectStore.index("linkedReport").getAll(reportID);

      request.onsuccess = () => {
        const readData = request.result as IDB_File[];

        resolve(readData);
      }

      request.onerror = (e) => {
        reject(e);
      }

      transaction.oncomplete = () => {
        db.close();
      }
    };

    DB.onerror = (e) => {
      reject(e);
    }
  });
}

export default ByReportID;