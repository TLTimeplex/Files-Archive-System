import GetIDB from "./getIDB";

export const ExistsFile = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const DB = GetIDB();

    DB.onsuccess = () => {
      const db = DB.result;
      const transaction = db.transaction("files", "readonly");
      const objectStore = transaction.objectStore("files");

      const request = objectStore.get(id);

      request.onsuccess = () => {
        if (request.result){
          resolve(true);
        }else{
          resolve(false);
        }
      }

      request.onerror = (e) => {
        resolve(false);
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

export default ExistsFile;