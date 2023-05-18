import { Button, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./style.css";

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
            return (
              <Card key={file}>
                {/*<Card.Img variant="top" src="holder.js/100px180" />*/}
                <Card.Body>
                  <Card.Title>{file}</Card.Title>
                  <Card.Text>
                    {localStorage.getItem("file-" + file)?.substring(0, 100) + "..."}
                  </Card.Text>
                  <Button variant="primary">Edit</Button>
                </Card.Body>
              </Card>
              )
          })}

        </div>
      </>
    );
  }else if (!fileList.includes(file)) {
    window.location.href = `/write/new/${file}`;
    return (<></>);
  }

  return (
    <></>
  );
};

export default WriteEdit;