import { IDB_Archive } from "../../../../../types/IDB_Archive";
import GetIDB from "../../getIDB";

export const byAuthor = async (author: string) : Promise<IDB_Archive[]> => {
  return new Promise((resolve, reject) => {
    const archiveDB = GetIDB();

    archiveDB.onsuccess = () => {
      const db = archiveDB.result;
      const tx = db.transaction("archive", "readonly");
      const store = tx.objectStore("archive");
      const index = store.index("author");
      const action = index.getAll(author);

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