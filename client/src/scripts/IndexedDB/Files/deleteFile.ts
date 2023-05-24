import GetIDB from "./getIDB";

export const DeleteFile = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;
      const transaction = db.transaction("files", "readwrite");
      const objectStore = transaction.objectStore("files");

      const request = objectStore.delete(id);

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

export default DeleteFile;