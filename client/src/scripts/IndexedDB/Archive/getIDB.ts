export const GetIDB = () : IDBOpenDBRequest => {
    const filesDB = indexedDB.open('archive', 1);

    filesDB.onerror = (err) => {
        console.log('Error while opening the database');
        console.log(err);
    };

    filesDB.onupgradeneeded = () => {
        const db = filesDB.result;
        const objectStore = db.createObjectStore("archive", { keyPath: "id" });
        objectStore.createIndex("title", "data.title", { unique: false });
        objectStore.createIndex("author", "meta.author", { unique: false });
        objectStore.createIndex("date", "meta.date", { unique: false });
    };

    return filesDB;
};

export default GetIDB;