import IDB_File from "../../../types/iDB_file";
import GetIDB from "./getIDB";

export const GetFile = async (id: string): Promise<IDB_File | undefined> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;
      const transaction = db.transaction("files", "readonly");
      const objectStore = transaction.objectStore("files");

      const request = objectStore.get(id);

      request.onsuccess = () => {
        const readData = request.result as IDB_File | undefined;

        if(!readData) {
          reject("No report found");
          return;
        }

        resolve(readData);
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

export default GetFile;