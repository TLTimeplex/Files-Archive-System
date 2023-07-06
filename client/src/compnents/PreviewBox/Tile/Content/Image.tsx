import FancyFileSize from "../../../../scripts/fancyFileSize";
import IDB_File from "../../../../types/iDB_file";

export interface ImageProps {
  file: IDB_File;
}

export const Image = (props: ImageProps) => {

  const openPreview = () => {
    const previewBody = document.getElementsByClassName("preview-body")[0] as HTMLDivElement;
    const previewImage = document.createElement("img");
    const url = URL.createObjectURL(props.file.data);
    previewImage.src = url;
    previewBody.innerHTML = "";
    previewBody.appendChild(previewImage);

    const previewHeader = document.getElementsByClassName("preview-header")[0] as HTMLDivElement;
    previewHeader.className = "preview-header image-preview";
    previewHeader.innerHTML = "";
    const previewTitle = document.createElement("h2");
    previewTitle.innerText = props.file.data.name;
    previewTitle.className = "preview-title";
    previewHeader.appendChild(previewTitle);
    const previewType = document.createElement("h3");
    previewType.innerText = props.file.data.type;
    previewType.className = "preview-type";
    previewHeader.appendChild(previewType);
    const previewSize = document.createElement("h3");
    previewSize.innerText = FancyFileSize(props.file.data.size);
    previewSize.className = "preview-size";
    previewHeader.appendChild(previewSize);
    const previewDate = document.createElement("h3");
    previewDate.innerText = new Date(props.file.data.lastModified).toLocaleDateString();
    previewDate.className = "preview-date";
    previewHeader.appendChild(previewDate);

    const previewFooter = document.getElementsByClassName("preview-footer")[0] as HTMLDivElement;
    previewFooter.className = "preview-footer image-preview";
    previewFooter.innerHTML = "";
    const downloadButtonContainer = document.createElement("a");
    downloadButtonContainer.href = url;
    downloadButtonContainer.download = props.file.data.name;
    downloadButtonContainer.className = "download-button-container";
    const downloadButton = document.createElement("img");
    downloadButton.src = "/assets/download.svg";
    downloadButton.className = "download-button";
    downloadButtonContainer.appendChild(downloadButton);
    previewFooter.appendChild(downloadButtonContainer);
    
    const previewRoot = document.getElementById("preview-root") as HTMLDivElement;
    previewRoot.className = "active";
  }

  return (
    <img src={URL.createObjectURL(props.file.data)} alt={props.file.data.name} onClick={() => openPreview()} />
  );
};

export default Image;