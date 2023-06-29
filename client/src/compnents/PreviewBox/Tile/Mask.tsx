import { Button } from "react-bootstrap";

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
      {props.removeCallback ? <Button variant="danger" className="preview-box__item__mask__remove" onClick={() => props.removeCallback?.(props.file)}>Delete</Button> : null}
    </div>
  )
}

export default Mask;