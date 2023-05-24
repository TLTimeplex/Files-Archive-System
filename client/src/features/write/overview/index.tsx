import { Button, Card } from "react-bootstrap";
import FAS_File from "../../../types/IDB_report";
import { ReportDB } from "../../../scripts/IndexedDB";
import { useState } from "react";
import "./style.css";

// TODO: Add Search!
export const Overview = () => {
  const [Reports, setReports] = useState<FAS_File[]>([]);

  ReportDB.getAllReports().then(reports => { setReports(reports) });

  return (
    <>
      <h1>Select Report to edit</h1>
      <div className="file-grid">
        {Reports.map((report: FAS_File) => {
          // CLEAN UP
          if (!report.title && !report.report && !report.fileIDs) {
            ReportDB.deleteReport(report.id);
            return null;
          }
          //
          if (!report.title) return null;
          const lastUpdate = new Date(report.updatedAt);
          const lastUpdateString = lastUpdate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
          return (
            <Card key={report.id}>
              <Card.Header>
                <Card.Title>{report.title}</Card.Title>
              </Card.Header>
              {/*<Card.Img variant="top" src="holder.js/100px180" />*/}
              <Card.Body>
                <Card.Text>
                  {(report.report) ? report.report.substring(0, 100) + (report.report.length > 100 ? "..." : "") : ""}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" href={`/write/edit/${report.id}`}>Edit</Button>
                <div className="last-edited">{lastUpdateString}</div>
              </Card.Footer>
            </Card>
          )
        })}
      </div>
      <hr />
      <div className="AddButtonBox">
        <Button variant="secondary" href="/write/new" className="AddButton">New Report</Button>
      </div>
    </>
  );
};

export default Overview;