import TileContent from "./Content";
import Mask from "./Mask";

export interface TileProps {
  file: File;
}

export const Tile = (props: TileProps) => {
  return (
    <div className="preview-box__item">
      <TileContent file={props.file} />
      <Mask file={props.file} />
    </div>
  );
};

export default Tile;