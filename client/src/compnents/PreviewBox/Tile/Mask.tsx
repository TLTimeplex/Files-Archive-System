import { CloseButton } from "react-bootstrap";
import FancyFileSize from "../../../scripts/fancyFileSize";
import DL_Icon from "./Download.png";

export interface MaskProps {
  file: File;
  removeCallback?: (file: File) => void;
}

export const Mask = (props: MaskProps) => {
  return (
    <div className="preview-box__item__mask">
      <div className="preview-box__item__mask__name">
        {props.file.name}
      </div>
      <div className="preview-box__item__mask__size">
        {FancyFileSize(props.file.size)}
      </div>
      {props.removeCallback ? <CloseButton className="preview-box__item__mask__remove" onClick={() => props.removeCallback?.(props.file)} /> : null}
      <div className="preview-box__item__mask__download">
        <a href={URL.createObjectURL(props.file)} download={props.file.name} >
          <img src={DL_Icon} alt="Download" />
        </a>
      </div>
    </div>
  )
}

export default Mask;