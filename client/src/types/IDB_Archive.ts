import IDB_File from "./iDB_file";

export type IDB_Archive = {
  id: string;
  data: {
    title: string;
    report: string;
    description?: string;
    files?: IDB_File[];
  };
  meta: {
    authorID: number;
    author: string;
    date: Date;
    fileIDs: string[];
  };
};