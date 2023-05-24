import { v4 } from "uuid";
import IDB_File from "../../../types/iDB_file";
import GetIDB_Files from "./getIDB_Files";

export const StoreIDB_File = async (file: File, ReportID: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB_Files();

    DB.onsuccess = (e) => {
      const db = DB.result;
      const transaction = db.transaction("files", "readwrite");
      const objectStore = transaction.objectStore("files");

      const fileData: IDB_File = {
        id: v4(),
        data: file,
        meta: {
          uploaded: 0,
          uploadedAt: new Date(),
          linkedFile: ReportID
        }
      };

      const request = objectStore.add(fileData);

      request.onsuccess = (e) => {
        resolve(fileData.id);
      }

      request.onerror = (e) => {
        reject(e);
      }

      transaction.oncomplete = (e) => {
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