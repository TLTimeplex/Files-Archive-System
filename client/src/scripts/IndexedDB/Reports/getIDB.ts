export const GetIDB = (): IDBOpenDBRequest => {
  const reportsDB = indexedDB.open('reports', 1);

  reportsDB.onerror = (err) => {
    console.log('Error while opening the database');
    console.log(err);
  };

  reportsDB.onupgradeneeded = (e) => {
    const db = reportsDB.result;
    const localReportStore = db.createObjectStore("local", { keyPath: "id" });
    localReportStore.createIndex("title", "title", { unique: false });
    localReportStore.createIndex("createdAt", "createdAt", { unique: false });
    localReportStore.createIndex("updatedAt", "updatedAt", { unique: false });

    const remoteReportStore = db.createObjectStore("remote", { keyPath: "id" });
    remoteReportStore.createIndex("title", "title", { unique: false });
    remoteReportStore.createIndex("createdAt", "createdAt", { unique: false });
    remoteReportStore.createIndex("updatedAt", "updatedAt", { unique: false });
  };

  return reportsDB;
};

export default GetIDB;