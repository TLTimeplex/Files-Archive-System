import Tile from "./Tile";
import "./style.scss";

export interface PreviewBoxProps {
  files: File[] | null;
}

export const PreviewBox = (props: PreviewBoxProps) => {
  return (
    <div className="preview-box">
      {props.files?.map((file, index) => (
        <Tile key={index} file={file} />
      ))}
    </div>
  );
};

export default PreviewBox;