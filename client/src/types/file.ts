export interface FAS_File {
  title: string;
  content?: string;
  authorID?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  _id?: number;
}

export default FAS_File;