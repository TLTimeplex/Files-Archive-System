import { Button, Card } from "react-bootstrap";
import AddAlert from "../../../../scripts/addAlert";
import FAS_File from "../../../../types/IDB_report";

// TODO: REDO!
export const Overview = () => {
  const files = localStorage.getItem("files");
  const fileList = files ? JSON.parse(files) : [];
  fileList.sort();

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
                  {(File.report) ? File.report.substring(0, 100) + (File.report.length > 100 ? "..." : "") : ""}
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
};

export default Overview;