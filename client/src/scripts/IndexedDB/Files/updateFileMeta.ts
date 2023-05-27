import GetIDB from "./getIDB";
import { IDB_File_Meta } from "../../../types/iDB_file";

export const updateFileMeta = async (fileID: string, fileMeta: IDB_File_Meta): Promise<void> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;
      const transaction = db.transaction("files", "readwrite");
      const objectStore = transaction.objectStore("files");

      const request = objectStore.get(fileID);

      request.onsuccess = () => {
        const file = request.result;
        file.meta = fileMeta;
        const request2 = objectStore.put(file);

        request2.onsuccess = () => {
          resolve();
        }

        request2.onerror = (e) => {
          reject(e);
        }
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

export default updateFileMeta;