import { Button, Card, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./style.css";
import AddAlert from "../../../scripts/addAlert";
import FAS_File from "../../../types/file";

export const WriteEdit = () => {

  const { file } = useParams();

  const files = localStorage.getItem("files");
  const fileList = files ? JSON.parse(files) : [];
  fileList.sort();

  // Show all available files
  if (!file || file === "") {
    return (
      <>
        <h1>Select File to edit</h1>
        <div className="file-grid">
          {fileList.map((file: string) => {
            const jsonFile = localStorage.getItem("file-" + file);
            const File = jsonFile ? (JSON.parse(jsonFile) as FAS_File) : null;
            if (!jsonFile || !File) {
              AddAlert(`Can't load file! File: ${file}`, "warning");
              //TODO give option to delete file
              return (<></>)
            }
            const lastUpdate = new Date(File.updatedAt);
            const lastUpdateString = lastUpdate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
            return (
              <Card key={file}>
                <Card.Header>
                  <Card.Title>{File.title}</Card.Title>
                </Card.Header>
                {/*<Card.Img variant="top" src="holder.js/100px180" />*/}
                <Card.Body>
                  <Card.Text>
                    {(File.content) ? File.content.substring(0, 100) + (File.content.length > 100 ? "..." : "") : ""}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button variant="primary" href={`/write/edit/${file}`}>Edit</Button>
                  <div className="last-edited">{lastUpdateString}</div>
                </Card.Footer>
              </Card>
            )
          })}

        </div>
      </>
    );
  } else if (!fileList.includes(file)) {
    window.location.href = `/write/new/${file}`;
    return (<></>);
  }

  return (
    <></>
  );
};

export default WriteEdit;