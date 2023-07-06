import IDB_File from "../../../types/iDB_file";
import TileContent from "./Content";
import Mask from "./Mask";

export interface TileProps {
  file: IDB_File;
  removeCallback?: (fileID: string) => void;
}

export const Tile = (props: TileProps) => {
  return (
    <div className="preview-box__item">
      <TileContent file={props.file} />
      <Mask file={props.file} removeCallback={props.removeCallback} />
    </div>
  );
};

export default Tile;