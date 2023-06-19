import { useEffect, useState } from "react";
import { ArchiveDB } from "../../../scripts/IndexedDB";
import { IDB_Archive } from "../../../types/IDB_Archive";
import { Button, Card } from "react-bootstrap";

export const Saved = () => {

  const [reports, setReports] = useState<IDB_Archive[]>([]);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init)
      return;
    ArchiveDB.getAllArchive().then((archive: IDB_Archive[]) => {
      setInit(true);
      setReports(archive);
    })
  }, [init, reports]);


  return (
    <div className="file-grid">
      {
        init ?
          reports.length !== 0 ?
            reports.map((value) => {
              return (
                <Card key={value.id} className="file-card">
                  <Card.Header>
                    <Card.Title>{value.data.title}</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>
                      DEBUG INFO <br />
                      ID: {value.id} <br />
                      Title: {value.data.title} <br />
                      Date: {value.meta.date.toUTCString()} <br />
                      Author: {value.meta.author}/{value.meta.authorID} <br />
                      files: {value.meta.fileIDs.length} <br />
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button variant="primary" href={`/archive/${value.id}`}>View</Button>
                  </Card.Footer>
                </Card>
              )
            })
            :
            "Nothing to see here"
          :
          "Loading..."
      }
    </div>
  )
}

export default Saved;