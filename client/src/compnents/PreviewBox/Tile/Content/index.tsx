import Image from "./Image";
import Application from "./application";

export interface TileContentProps {
  file: File
};

export const TileContent = (props: TileContentProps) => {

  const [Class, Type] = props.file.type.split("/");

  if (Class === "image") {
    return (
      <Image file={props.file} />
    )
  }

  if (Class === "application") {
    return (
      <Application file={props.file} />
    )
  }

  return (
    <>{Class + " - " + Type}</>
  )
};

export default TileContent;