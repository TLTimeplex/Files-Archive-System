import IDB_DB_Select from "../../../types/IDB_DB_Select";
import IDB_Report from "../../../types/IDB_report";
import getIDB from "./getIDB";

/**
 * Get all reports from the database
 * @param type Database to get reports from. If "all", will get reports from both local and remote databases
 * @returns 
 */
export const GetAllReports = async (type: IDB_DB_Select): Promise<IDB_Report[]> => {
  return new Promise((resolve, reject) => {
    const DB = getIDB();

    DB.onsuccess = () => {
      const db = DB.result;

      let promises: Promise<IDB_Report[]>[] = [];

      if (type === "local" || type === "all") {
        promises.push(new Promise((resolve, reject) => {
          const transaction = db.transaction("local", "readonly");
          const objectStore = transaction.objectStore("local");

          const request = objectStore.getAll();

          request.onsuccess = () => {
            const readData = request.result;

            if (!readData) {
              resolve([]);
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
        }));
      }

      if (type === "remote" || type === "all") {
        promises.push(new Promise((resolve, reject) => {
          const transaction = db.transaction("remote", "readonly");
          const objectStore = transaction.objectStore("remote");

          const request = objectStore.getAll();

          request.onsuccess = () => {
            const readData = request.result;

            if (!readData) {
              resolve([]);
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
        }));
      }

      Promise.all(promises).then((values) => {
        let reports: IDB_Report[] = [];

        values.forEach((value) => {
          reports = reports.concat(value);
        });

        resolve(reports);
      }).catch((e) => {
        reject(e);
      });
    };

    DB.onerror = (e) => {
      reject(e);
    }
  });
};

export default GetAllReports;