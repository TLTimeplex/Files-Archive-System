import IDB_File from "../../../types/iDB_file";
import GetIDB from "./getIDB";

export const InsertFile = async (file: IDB_File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;
      const transaction = db.transaction("files", "readwrite");
      const objectStore = transaction.objectStore("files");

      const request = objectStore.add(file);

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
    };

    DB.onerror = (e) => {
      reject(e);
    }

  });
};

export default InsertFile;