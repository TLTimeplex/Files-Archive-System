export interface ImageProps {
  file: File;
}

export const Image = (props: ImageProps) => {
  return (
    <img src={URL.createObjectURL(props.file)} alt={props.file.name} />
  );
};

export default Image;