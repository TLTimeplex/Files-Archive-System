import getIDB from "./getIDB";

export const deleteArchive = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const archiveDB = getIDB();

    archiveDB.onsuccess = () => {
      const db = archiveDB.result;
      const tx = db.transaction("archive", "readwrite");
      const store = tx.objectStore("archive");

      const action = store.delete(id);

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
    };
  });
}