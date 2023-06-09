import { Button, Card } from "react-bootstrap";
import { ReportDB } from "../../../scripts/IndexedDB";
import IDB_Report from "../../../types/IDB_report";

export interface cardBoxProps {
  reports: IDB_Report[];
  type: "local" | "remote" | "remoteChanged" | "sync" | "merge";
}

export const CardBox = (props: cardBoxProps): React.ReactElement | null => {

  console.log(props);

  return (
    <div id={props.type + "Container"} className="file-grid">
      {props.reports.map((report: IDB_Report) => {

        // CLEAN UP
        if (props.type === "local") {
          if (!report.title && !report.report && !report.fileIDs) {
            ReportDB.deleteReport(report.id, "local");
            return null;
          }
        }
        const lastUpdate = new Date(report.updatedAt);
        const lastUpdateString = lastUpdate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

        return (
          <Card key={report.id} className={/*false ? "green-border" : "yellow-border" */ ""}>
            <Card.Header>
              <Card.Title>{report.title}</Card.Title>
            </Card.Header>
            {/*<Card.Img variant="top" src="holder.js/100px180" />*/}
            <Card.Body>
              <Card.Text>
                {/*(report.report) ? report.report.substring(0, 100) + (report.report.length > 100 ? "..." : "") : ""*/}
                DEBUGINFO: <br />
                Type: {props.type}<br />
                ID: {report.id}<br />
                Title: {report.title}<br />
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <div className="ButtonBox">
                {props.type !== "merge" ? <Button variant="primary" href={`/report/edit/${report.id}`}>Edit</Button> : null} {" "}
                {props.type === "sync" ? <Button variant="warning" href={`/report/` /*TODO:*/}>Sync</Button> : null}
                {props.type === "merge" ? <Button variant="warning" href={`/report/` /*TODO:*/}>Merge</Button> : null}
              </div>
              <div className="last-edited">{lastUpdateString}</div>
            </Card.Footer>
          </Card>);
      })}
    </div>
  );
};

export default CardBox;