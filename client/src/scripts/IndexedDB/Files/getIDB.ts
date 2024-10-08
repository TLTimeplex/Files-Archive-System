export const GetIDB = () : IDBOpenDBRequest => {
    const filesDB = indexedDB.open('files', 1);

    filesDB.onerror = (err) => {
        console.log('Error while opening the database');
        console.log(err);
    };

    filesDB.onupgradeneeded = () => {
        const db = filesDB.result;
        const objectStore = db.createObjectStore("files", { keyPath: "id" });
        objectStore.createIndex("filename", "data.name", { unique: false });
        objectStore.createIndex("linkedReport", "meta.linkedReport", { unique: false });
    };

    return filesDB;
};

export default GetIDB;