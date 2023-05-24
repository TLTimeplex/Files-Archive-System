import { v4 } from "uuid";
import InsertFile from "./insertFile";

export const CreateFile = async (file: File, ReportID: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const id = v4();
    InsertFile({
      id: id,
      data: file,
      meta: {
        uploaded: 0,
        uploadedAt: new Date(),
        linkedReport: ReportID
      }
    }).then(() => {
      resolve(id)
    }).catch((e) => {
      reject(e)
    });
  });
};

export default CreateFile;