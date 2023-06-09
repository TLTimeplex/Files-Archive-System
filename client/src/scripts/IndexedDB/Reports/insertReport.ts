import GetIDB from "./getIDB";
import IDB_Report from "../../../types/IDB_report";
import IDB_DB_Select from "../../../types/IDB_DB_Select";

/**
 * Insert a NEW report into the database. Will not overwrite existing reports and will throw an error if a report with the same ID already exists.
 * @param report 
 * @param type Type of database to insert report into (local or remote). Will insert into both if "all" is passed
 * @returns 
 */
export const InsertReport = async (report: IDB_Report, type: IDB_DB_Select): Promise<void> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = (e) => {
      const db = DB.result;

      let promises: Promise<void>[] = [];

      if (type === "local" || type === "all") {
        promises.push(new Promise((resolve, reject) => {
          const transaction = db.transaction("local", "readwrite");
          const objectStore = transaction.objectStore("local");

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
        }));
      }

      if (type === "remote" || type === "all") {
        promises.push(new Promise((resolve, reject) => {
          const transaction = db.transaction("remote", "readwrite");
          const objectStore = transaction.objectStore("remote");

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
        }));
      }

      Promise.all(promises).then(() => {
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

export default InsertReport;