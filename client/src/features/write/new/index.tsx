import { useParams } from 'react-router-dom';
import { ReportDB } from "../../../scripts/IndexedDB";
import { Spinner } from 'react-bootstrap';
import "./style.css";

export const WriteNew = () => {

  const { title } = useParams();

  ReportDB.createReport(title).then((reportID) => {
    window.location.href = "/write/edit/" + reportID;
  })

  return (
    <div className="LoadingBox">
      <Spinner animation="border" variant="primary" className='LoadingSpinner'/>
      <h2>Creating new Report...</h2>
    </div>
  );

  //useEffect(() => {
    /*
    const drawPreview = (files: FileList | Array<File> | File[], clear: boolean): void => {
      const container = document.getElementById("uploaded-files-preview") as HTMLFormElement;
      if (clear) container.innerHTML = "";
      if (!files) return;

      if (files.length === 0) return;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        const reader = new FileReader();
        reader.onload = (event) => {
          if (!event.target) return;
          const card = createCard(file.name, file.type === "" ? "Unknown" : file.type.split("/")[0], file, fileSize(file.size));
          container.appendChild(card);
        }
        reader.readAsDataURL(file);
      }

    };
    */
  //}, [title]);
};

export default WriteNew;