import IDB_DB_Select from "../../../types/IDB_DB_Select";
import GetIDB from "./getIDB";

export const existsReport = async (id: string, select: IDB_DB_Select): Promise<IDB_DB_Select | null> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;

      let promises: Promise<IDB_DB_Select | null>[] = [];

      if (select === "local" || select === "all") {
        promises.push(new Promise((resolve, reject) => {
          const transaction = db.transaction("local", "readonly");
          const objectStore = transaction.objectStore("local");

          const request = objectStore.get(id);

          request.onsuccess = () => {
            const readData = request.result;

            if (!readData) {
              resolve(null);
              return;
            }

            resolve("local");
          }

          request.onerror = (e) => {
            resolve(null);
          }

          transaction.oncomplete = () => {
            db.close();
          }
        }));
      }

      if (select === "remote" || select === "all") {
        promises.push(new Promise((resolve, reject) => {
          const transaction = db.transaction("remote", "readonly");
          const objectStore = transaction.objectStore("remote");

          const request = objectStore.get(id);

          request.onsuccess = () => {
            const readData = request.result;

            if (!readData) {
              resolve(null);
              return;
            }

            resolve("remote");
          }

          request.onerror = (e) => {
            resolve(null);
          }

          transaction.oncomplete = () => {
            db.close();
          }
        }));
      }

      Promise.all(promises).then((values) => {
        if (values.length === 0) resolve(null);
        else {
          if (values.includes("local") && values.includes("remote")) resolve("all");
          else if (values.includes("local")) resolve("local");
          else if (values.includes("remote")) resolve("remote");
          else resolve(null);
        }
      }).catch((e) => {
        reject(e);
      });
    }

    DB.onerror = (e) => {
      reject(e);
    }

  });
};

export default existsReport;