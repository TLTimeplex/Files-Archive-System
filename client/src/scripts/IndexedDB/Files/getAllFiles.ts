import GetIDB from "./getIDB";

export const GetAllFile = async (): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;
      const transaction = db.transaction("files", "readonly");
      const objectStore = transaction.objectStore("files");

      const request = objectStore.getAll();

      request.onsuccess = () => {
        const readData = request.result as File[];

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

export default GetAllFile;