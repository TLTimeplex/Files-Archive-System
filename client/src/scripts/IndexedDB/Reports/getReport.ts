import IDB_Report from "../../../types/IDB_report";
import GetIDB from "./getIDB";

export const GetReport = async (id: string): Promise<IDB_Report> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;
      const transaction = db.transaction("reports", "readonly");
      const objectStore = transaction.objectStore("reports");

      const request = objectStore.get(id);

      request.onsuccess = () => {
        const readData = request.result;

        if(!readData) {
          reject("No report found");
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
}

export default GetReport;