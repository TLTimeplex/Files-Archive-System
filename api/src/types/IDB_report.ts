export interface IDB_Report {
  id: string;

  title?: string;
  report?: string;

  createdAt: Date;
  updatedAt: Date;

  authorID?: number;
  description?: string;

  fileIDs?: string[];

  restrictions?: string;
}

export default IDB_Report;