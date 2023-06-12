import { IDB_Archive } from "../../../types/IDB_Archive";
import GetIDB from "./getIDB";

export const setArchive = async (archive: IDB_Archive): Promise<void> => {
  return new Promise((resolve, reject) => {
    const archiveDB = GetIDB();

    archiveDB.onsuccess = () => {
      const db = archiveDB.result;
      const tx = db.transaction("archive", "readwrite");
      const store = tx.objectStore("archive");
      const action =  store.put(archive);

      action.onsuccess = () => {
        resolve();
      };

      action.onerror = (err) => {
        reject(err);
      };

      tx.oncomplete = () => {
        db.close();
      };

      tx.onerror = (err) => {
        reject(err);
      };
    };

    archiveDB.onerror = (err) => {
      reject(err);
    }
  });
}