import TileContent from "./Content";
import Mask from "./Mask";

export interface TileProps {
  file: File;
  removeCallback?: (file: File) => void;
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