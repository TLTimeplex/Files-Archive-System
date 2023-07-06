import IDB_File from "../../../../../types/iDB_file";
import Icon_PDF from "./icons/PDF.png";
import Icon_UKN from "./icons/Unknown.png";

export interface ApplicationProps {
  file: IDB_File;
}

export const Application = (props: ApplicationProps) => {
  const type = props.file.data.type.split("/")[1];

  let icon = <></>;

  switch (type) {
    case "pdf":
      icon = <img src={Icon_PDF} alt="PDF" />;
      break;
    default:
      icon = <img src={Icon_UKN} alt="Unknown" />;
      break;
  }

  return (
    <div className="preview-box__item__content__application">
      <div className="preview-box__item__content__application__icon">
        {icon}
      </div>
      <div className="preview-box__item__content__application__name">
        {props.file.data.name.replace(/\.[^/.]+$/, "")}
      </div>
    </div>
  )
};

export default Application;