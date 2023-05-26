import IDB_Report from "../../../types/IDB_report";
import getIDB from "./getIDB";

export const GetAllReports = async (): Promise<IDB_Report[]> => {
  return new Promise((resolve, reject) => {
    const DB = getIDB();

    DB.onsuccess = () => {
      const db = DB.result;
      const transaction = db.transaction("reports", "readonly");
      const objectStore = transaction.objectStore("reports");

      const request = objectStore.getAll();

      request.onsuccess = () => {
        const readData = request.result;

        if(!readData) {
          reject("No reports found");
          return;
        }

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
};

export default GetAllReports;