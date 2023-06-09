import IDB_DB_Select from "../../../types/IDB_DB_Select";
import IDB_Report from "../../../types/IDB_report";
import GetIDB from "./getIDB";

/**
 * Get a single report from the database by ID
 * @param id ID of report @param type Type of database to search for report. If "all", will search both local and remote databases but will return the local database's report if it exists.
 * @returns A report that matches the ID and type, or undefined if no report is found
 */
export const GetReport = async (id: string, type: IDB_DB_Select): Promise<IDB_Report | undefined> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;

      if (type === "local" || type === "all") {
        const transaction = db.transaction("local", "readonly");
        const objectStore = transaction.objectStore("local");

        const request = objectStore.get(id);

        request.onsuccess = () => {
          const readData = request.result;

          if (!readData)
            GetReport(id, "remote").then((remoteData) => { resolve(remoteData) }).catch((e) => { reject(e) }); // If the report is not found in the local database, try to find it in the remote database
          else
            resolve(readData);
        }

        request.onerror = (e) => {
          reject(e);
        }

        transaction.oncomplete = () => {
          db.close();
        }
      };


      if (type === "remote") {
        const transaction = db.transaction("remote", "readonly");
        const objectStore = transaction.objectStore("remote");

        const request = objectStore.get(id);

        request.onsuccess = () => {
          const readData = request.result;

          if (!readData)
            resolve(undefined);
          else
            resolve(readData);
        }

        request.onerror = (e) => {
          reject(e);
        }

        transaction.oncomplete = () => {
          db.close();
        }
      }

    };

    DB.onerror = (e) => {
      reject(e);
    }
  });
}

export default GetReport;