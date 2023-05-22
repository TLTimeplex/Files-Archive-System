export interface FAS_Report {
  id: string;

  title?: string;
  report?: string;

  createdAt: Date;
  updatedAt: Date;

  authorID?: number;
  description?: string;

  fileIDs?: string[];
}

export default FAS_Report;