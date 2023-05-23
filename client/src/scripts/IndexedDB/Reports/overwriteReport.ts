import GetIDB from "./getIDB";
import IDB_Report from "../../../types/IDB_report";

export const OverwriteReport = async (report: IDB_Report): Promise<void> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;
      const transaction = db.transaction("reports", "readwrite");
      const objectStore = transaction.objectStore("reports");

      const request = objectStore.get(report.id);

      request.onsuccess = () => {
        const readData = request.result;

        if(!readData) {
          reject("No report found");
          return;
        }

        const updateRequest = objectStore.put(report);

        updateRequest.onsuccess = () => {
          resolve();
        }

        updateRequest.onerror = (e) => {
          reject(e);
        }
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
};

export default OverwriteReport;