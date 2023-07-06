import IDB_File from "../../types/iDB_file";
import Tile from "./Tile";
import "./style.scss";

export interface PreviewBoxProps {
  files: IDB_File[] | null;
  removeCallback?: (fileID: string) => void;
}

export const PreviewBox = (props: PreviewBoxProps) => {
  return (
    <div className="preview-box">
      {props.files?.map((file, index) => (
        <Tile key={index} file={file} removeCallback={props.removeCallback} />
      ))}
    </div>
  );
};

export default PreviewBox;