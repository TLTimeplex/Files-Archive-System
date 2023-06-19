import { useEffect, useState } from "react";
import { IDB_Archive } from "../../../types/IDB_Archive";
import axios from "axios";
import ReportFilter, { ReportFieldSelect } from "../../../types/ReportFilter";
import { Button, Card } from "react-bootstrap";

export const Archived = () => {
  const [reports, setReports] = useState<IDB_Archive[]>([]);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init)
      return;

    const filter: ReportFilter = {
      archived: true,
    };

    const select: ReportFieldSelect = {
      "id": true,
      "title": true,
      //"access": true,
      "author_id": true,
      "author_name": true,
      "date_modified": true,
    }

    axios.post(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report`, { filter: filter, select: select }).then((res) => {
      if (!res.data.success) {
        console.log(res.data.error);
        return;
      }

      const rawData: any[] = res.data.data;

      const reports: IDB_Archive[] = rawData.map((value) => {
        return {
          id: value.id,
          data: {
            title: value.title,
            report: "",
            description: value.description,
          },
          meta: {
            authorID: value.author_id,
            author: value.author_name,
            date: new Date(value.date_modified),
            fileIDs: [],
          }
        }
      });

      setReports(reports);
      setInit(true);
    });
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

export default Archived;