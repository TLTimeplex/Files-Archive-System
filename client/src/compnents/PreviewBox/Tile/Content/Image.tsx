import FancyFileSize from "../../../../scripts/fancyFileSize";

export interface ImageProps {
  file: File;
}

export const Image = (props: ImageProps) => {

  const openPreview = () => {
    const previewBody = document.getElementsByClassName("preview-body")[0] as HTMLDivElement;
    const previewImage = document.createElement("img");
    const url = URL.createObjectURL(props.file);
    previewImage.src = url;
    previewBody.innerHTML = "";
    previewBody.appendChild(previewImage);

    const previewHeader = document.getElementsByClassName("preview-header")[0] as HTMLDivElement;
    previewHeader.className = "preview-header image-preview";
    previewHeader.innerHTML = "";
    const previewTitle = document.createElement("h2");
    previewTitle.innerText = props.file.name;
    previewTitle.className = "preview-title";
    previewHeader.appendChild(previewTitle);
    const previewType = document.createElement("h3");
    previewType.innerText = props.file.type;
    previewType.className = "preview-type";
    previewHeader.appendChild(previewType);
    const previewSize = document.createElement("h3");
    previewSize.innerText = FancyFileSize(props.file.size);
    previewSize.className = "preview-size";
    previewHeader.appendChild(previewSize);
    const previewDate = document.createElement("h3");
    previewDate.innerText = new Date(props.file.lastModified).toLocaleDateString();
    previewDate.className = "preview-date";
    previewHeader.appendChild(previewDate);

    const previewRoot = document.getElementById("preview-root") as HTMLDivElement;
    previewRoot.className = "active";
  }

  return (
    <img src={URL.createObjectURL(props.file)} alt={props.file.name} onClick={() => openPreview()} />
  );
};

export default Image;