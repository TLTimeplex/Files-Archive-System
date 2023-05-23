import GetIDB from "./getIDB";
import IDB_Report from "../../../types/IDB_report";

export const UpdateReport = async (report: IDB_Report): Promise<void> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = (e) => {
      const db = DB.result;
      const transaction = db.transaction("reports", "readwrite");
      const objectStore = transaction.objectStore("reports");

      const request = objectStore.get(report.id);

      request.onsuccess = (e) => {
        const readData = request.result;

        if(!readData) {
          reject("No report found");
          return;
        }

        const updatedData: IDB_Report = {
          ...readData,
          ...report,
          updatedAt: new Date()
        };

        const updateRequest = objectStore.put(updatedData);

        updateRequest.onsuccess = (e) => {
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

export default UpdateReport;