import GetIDB from "./getIDB";
import IDB_Report from "../../../types/IDB_report";
import IDB_DB_Select from "../../../types/IDB_DB_Select";

/**
 * Overwrite a report in the database. Will throw an error if the report does not exist.
 * @param report 
 * @param type Database to overwrite report in (local or remote). Will overwrite in both if "all" is passed
 * @returns 
 */
export const OverwriteReport = async (report: IDB_Report, type: IDB_DB_Select): Promise<void> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;

      let promises: Promise<boolean>[] = [];

      if (type === "local" || type === "all") {
        promises.push(new Promise((resolve, reject) => {
          const transaction = db.transaction("local", "readwrite");
          const objectStore = transaction.objectStore("local");

          const request = objectStore.get(report.id);

          request.onsuccess = () => {
            const readData = request.result;

            if (!readData) {
              resolve(false);
              return;
            }

            const updateRequest = objectStore.put(report);

            updateRequest.onsuccess = () => {
              resolve(true);
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
        }));
      }

      if (type === "remote" || type === "all") {
        promises.push(new Promise((resolve, reject) => {
          const transaction = db.transaction("remote", "readwrite");
          const objectStore = transaction.objectStore("remote");

          const request = objectStore.get(report.id);

          request.onsuccess = () => {
            const readData = request.result;

            if (!readData) {
              resolve(false);
              return;
            }

            const updateRequest = objectStore.put(report);

            updateRequest.onsuccess = () => {
              resolve(true);
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
        }));
      }

      Promise.all(promises).then((success) => {
        if (!success.includes(true))
          reject("No report found");
        else
          resolve();
      }).catch((e) => {
        reject(e);
      });

    };

    DB.onerror = (e) => {
      reject(e);
    }

  });
};

export default OverwriteReport;