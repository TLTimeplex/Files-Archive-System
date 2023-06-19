import { IDB_Archive } from "../../../types/IDB_Archive";
import GetIDB from "./getIDB";

export const existsArchive = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const archiveDB = GetIDB();

    archiveDB.onsuccess = () => {
      const db = archiveDB.result;
      const tx = db.transaction("archive", "readonly");
      const store = tx.objectStore("archive");
      const action = store.get(id);

      action.onsuccess = () => {
        if (action.result){
          resolve(true);
        }else{
          resolve(false);
        }
      };

      action.onerror = (err) => {
        resolve(false);
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