import { Button, Card } from "react-bootstrap";
import FAS_File, { IDB_Report } from "../../../types/IDB_report";
import { ReportDB } from "../../../scripts/IndexedDB";
import { useState } from "react";
import "./style.scss";
import axios from "axios";
import ReportFilter, { ReportFieldSelect } from "../../../types/ReportFilter";
import AddAlert from "../../../scripts/addAlert";

// TODO: Add Search!
// TODO: Add Synchronisation with server
export const Overview = () => {
  const [Reports, setReports] = useState<FAS_File[]>([]);
  const [init, setInit] = useState<boolean>(false);

  //TODO: REDO!
  const sync = async () => {
    const filter: ReportFilter = {
      author_id: [1], //TODO: Get own ID
      archived: false,
    };

    const select : ReportFieldSelect = {
      id: true,
      date_modified: true,
    }

    const res = await axios.post(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report`, { filter: filter, select: select });
    if (!res.data.success) {
      console.log(res.data);
      AddAlert(res.data.message, "danger");
      return;
    }

    const reportIDs = res.data.data as any[]; //TODO: type

    console.log(await ReportDB.getAllReports("all"));
    /*
    let tasks: Promise<void>[] = [];

    reportIDs.forEach((reportID: string) => {
      tasks.push(new Promise((resolve, reject) => {
        axios.get(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report/${reportID}`).then(result => {
          if (!result.data.success) {
            console.log(result.data);
            AddAlert(result.data.message, "danger");
            reject();
          }
          const remoteReport = result.data.report as IDB_Report;
          remoteReport.uploaded = true;
          ReportDB.getReport(remoteReport.id).then(localReport => {
            if (!localReport) {
              ReportDB.insertReport(remoteReport).then(() => resolve());
              return;
            }
            if (!localReport.uploaded) {
              ReportDB.updateReport(remoteReport).then(() => resolve());
              return;
            }
            if (new Date(localReport.updatedAt) < new Date(remoteReport.updatedAt)) {
              ReportDB.updateReport(remoteReport);
            }
            resolve();
          }).catch(err => {
            ReportDB.insertReport(remoteReport).then(() => resolve());
          });
        })
      }));
    });
    Promise.all(tasks).then(() => {
      ReportDB.getAllReports().then(reports => {
        setReports(reports)
      })
    });
    */
  };

  if (!init) {
    sync();
    setInit(true);
  }

  return (
    <>
      <h1>Select Report to edit</h1>
      <div className="file-grid">
        {Reports.map((report: FAS_File) => {
          // CLEAN UP
          if (!report.title && !report.report && !report.fileIDs) {
            //ReportDB.deleteReport(report.id);
            return null;
          }
          //
          if (!report.title) return null;
          const lastUpdate = new Date(report.updatedAt);
          const lastUpdateString = lastUpdate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
          return (
            <Card key={report.id} className={false ? "green-border" : "yellow-border" /** TODO: Check if is uploaded */}> 
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
                <Button variant="primary" href={`/report/edit/${report.id}`}>Edit</Button>
                <div className="last-edited">{lastUpdateString}</div>
              </Card.Footer>
            </Card>
          )
        })}
      </div>
      <hr />
      <div className="AddButtonBox">
        <Button variant="secondary" href="/report/new" className="AddButton">New Report</Button>
      </div>
    </>
  );
};

export default Overview;