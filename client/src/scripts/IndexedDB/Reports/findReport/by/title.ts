import IDB_Report from "../../../../../types/IDB_report";

export const byTitle = async (title: string): Promise<IDB_Report[]> => {
  return new Promise((resolve, reject) => {
    const DB = indexedDB.open("reports");

    DB.onsuccess = () => {
      const db = DB.result;
      const transaction = db.transaction("reports", "readonly");
      const objectStore = transaction.objectStore("reports");

      const request = objectStore.index("title").getAll(title);

      request.onsuccess = () => {
        const readData = request.result;

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
    };

    DB.onerror = (e) => {
      reject(e);
    }
  });
}

export default byTitle;
