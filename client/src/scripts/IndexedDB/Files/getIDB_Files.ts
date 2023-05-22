export const GetIDB_Files = () : IDBOpenDBRequest => {
    const filesDB = indexedDB.open('files', 1);

    filesDB.onerror = (err) => {
        console.log('Error while opening the database');
        console.log(err);
    };

    filesDB.onupgradeneeded = (e) => {
        const db = filesDB.result;
        const objectStore = db.createObjectStore("files", { keyPath: "id" });
        objectStore.createIndex("filename", "data.name", { unique: false });
        objectStore.createIndex("uploaded", "meta.uploaded", { unique: false });
        objectStore.createIndex("uploadedAt", "meta.uploadedAt", { unique: false });
        objectStore.createIndex("linkedFile", "meta.linkedFile", { unique: false });
    };

    return filesDB;
};

export default GetIDB_Files;