import { Button } from "react-bootstrap";
import IDB_File from "../../../types/iDB_file";

export interface MaskProps {
  file: IDB_File;
  removeCallback?: (fileID: string) => void;
}

export const Mask = (props: MaskProps) => {
  return (
    <div className="preview-box__item__mask">
      <div className="preview-box__item__mask__name">
        {props.file.data.name}
      </div>
      {props.removeCallback ? <Button variant="danger" className="preview-box__item__mask__remove" onClick={() => props.removeCallback?.(props.file.id)}>Delete</Button> : null}
    </div>
  )
}

export default Mask;