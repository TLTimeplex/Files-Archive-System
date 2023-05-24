export default interface IDB_File {
  id: string;
  data: File;
  meta: IDB_File_Meta;
} 

export interface IDB_File_Meta {
  uploaded: number;
  uploadedAt: Date;
  linkedReport: string;
}