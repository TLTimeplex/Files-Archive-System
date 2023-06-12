import { IDB_Archive } from "../../../types/IDB_Archive";
import { getIDB } from "../Files";

export const getAllArchive = async (): Promise<IDB_Archive[]> => {
  return new Promise((resolve, reject) => {
    const archiveDB = getIDB();

    archiveDB.onsuccess = () => {
      const db = archiveDB.result;
      const tx = db.transaction("archive", "readonly");
      const store = tx.objectStore("archive");
      const action = store.getAll();

      action.onsuccess = () => {
        resolve(action.result);
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
    };
  });
}