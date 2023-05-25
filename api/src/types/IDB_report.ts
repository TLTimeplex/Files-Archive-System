export interface IDB_Report {
  id: string;

  title?: string;
  report?: string;

  createdAt: Date;
  updatedAt: Date;

  authorID?: number;
  description?: string;

  fileIDs?: string[];

  uploaded?: boolean;
}

export default IDB_Report;