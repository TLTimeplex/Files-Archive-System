export type IDB_Archive = {
  id: string;
  data: {
    title: string;
    report: string;
    description?: string;
    files?: File[];
  };
  meta: {
    authorID: number;
    author: string;
    date: Date;
    fileIDs: string[];
  };
};