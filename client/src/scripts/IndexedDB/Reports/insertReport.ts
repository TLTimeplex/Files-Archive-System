import GetIDB from "./getIDB";
import IDB_Report from "../../../types/IDB_report";

export const InsertReport = async (report: IDB_Report): Promise<void> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = (e) => {
      const db = DB.result;
      const transaction = db.transaction("reports", "readwrite");
      const objectStore = transaction.objectStore("reports");

      const request = objectStore.add(report);

      request.onsuccess = () => {
        resolve();
      }

      request.onerror = (e) => {
        reject(e);
      }

      transaction.oncomplete = () => {
        db.close();
      }

      transaction.onerror = (e) => {
        reject(e);
      }
    };

    DB.onerror = (e) => {
      reject(e);
    }

  });
};

export default InsertReport;