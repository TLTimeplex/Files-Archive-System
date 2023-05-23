export const GetIDB = () : IDBOpenDBRequest => {
    const reportsDB = indexedDB.open('reports', 1);

    reportsDB.onerror = (err) => {
        console.log('Error while opening the database');
        console.log(err);
    };

    reportsDB.onupgradeneeded = (e) => {
        const db = reportsDB.result;
        const objectStore = db.createObjectStore("reports", { keyPath: "id" });
        objectStore.createIndex("title", "title", { unique: false });
        objectStore.createIndex("createdAt", "createdAt", { unique: false });
        objectStore.createIndex("updatedAt", "updatedAt", { unique: false });
    };

    return reportsDB;
};

export default GetIDB;