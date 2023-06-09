import IDB_DB_Select from "../../../types/IDB_DB_Select";
import GetIDB from "./getIDB";

/**
 * This will delete a report from the database by ID. Will throw an error if the report does not exist.
 * @param id 
 * @param type Database to delete report from (local or remote). Will delete from both if "all" is passed
 * @returns 
 */
export const DeleteReport = async (id: string, type: IDB_DB_Select): Promise<void> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;

      let promises: Promise<boolean>[] = [];

      if (type === "local" || type === "all") {
        promises.push(new Promise((resolve, reject) => {
          const transaction = db.transaction("local", "readwrite");
          const objectStore = transaction.objectStore("local");

          const request = objectStore.delete(id);

          request.onsuccess = () => {
            resolve(true);
          }

          request.onerror = (e) => {
            resolve(false);
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

          const request = objectStore.delete(id);

          request.onsuccess = () => {
            resolve(true);
          }

          request.onerror = (e) => {
            resolve(false);
          }

          transaction.oncomplete = () => {
            db.close();
          }

          transaction.onerror = (e) => {
            reject(e);
          }
        }));
      }

      Promise.all(promises).then((values) => {
        if (values.includes(true)) {
          resolve();
        } else {
          reject("Report not found");
        }
      }).catch((e) => {
        reject(e);
      });
    };

    DB.onerror = (e) => {
      reject(e);
    }
  });
};

export default DeleteReport;