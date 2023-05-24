import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import IDB_Report from "../../../types/IDB_report";
import "./style.css";
import * as ReportsDB from "../../../scripts/IndexedDB/Reports"
import AddAlertLoader2 from "../../../scripts/addAlertLoader2";


export const Editor = () => {
  const { ReportTitel_OR_ID } = useParams();

  const [Report, setReport] = useState<IDB_Report>();

  useEffect(() => {
    if (!Report) return;

    /********************** HTML ELEMENTS *********************/
    // Form
    const form = document.getElementById("new-form") as HTMLFormElement;
    // Text-Fields
    const title = document.getElementById("title") as HTMLInputElement;
    const report = document.getElementById("report") as HTMLTextAreaElement;
    // Buttons
    const save = document.getElementById("new-save") as HTMLButtonElement;
    const upload = document.getElementById("new-upload") as HTMLButtonElement;
    // File-Upload
    const fileUpload = document.getElementById("fileUpload") as HTMLInputElement;
    const uploadedFilesPreview = document.getElementById("uploaded-files-preview") as HTMLDivElement;

    if (!form || !title || !report || !save || !upload || !fileUpload || !uploadedFilesPreview) {
      console.error("You shouldn't be here!");
      return;
    }
    /*********************************************************/

    /********************** LOAD CONTENT **********************/
    if (Report?.title) title.value = Report.title;
    if (Report?.report) report.value = Report.report;

    if (Report?.fileIDs) {
      Report.fileIDs.forEach(async fileID => {
        // TODO: Get file from database
        // OR:   Draw directly from Report.fileIDs
      });
    }
    /*********************************************************/

    /********************* EVENT LISTENER *********************/
    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    save.addEventListener("click", () => {
      saveReport();
    });

    upload.addEventListener("click", () => {
      //TODO: Upload the files to the database after saving the report 
    });

    fileUpload.addEventListener("change", () => {
      // eslint-disable-next-line
      const files = fileUpload.files;
      // TODO:
      // Save the files to the database
      // Redraw the preview
    });

    // Auto resize textarea + 1 time on load
    report.addEventListener("keydown", (event) => {
      report.style.height = "auto";
      report.style.height = (report.scrollHeight + 2) + "px";
    });

    report.addEventListener("click", (event) => {
      report.style.height = "auto";
      report.style.height = (report.scrollHeight + 2) + "px";
    });

    report.addEventListener("change", (event) => {
      report.style.height = "auto";
      report.style.height = (report.scrollHeight + 2) + "px";
    });

    report.style.height = "auto";
    report.style.height = (report.scrollHeight + 2) + "px";

    // save per STRG + S
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        saveReport();
      }
    });
    /*********************************************************/

    /******************** LOCAL FUNCTIONS ********************/
    const drawPreview = () => {
      Report.fileIDs?.forEach(async fileID => {
        
      });
    }

    const saveReport = () => {
      AddAlertLoader2("Saving report...", "info", new Promise((resolve, reject) => {
        Report.title = title.value;
        Report.report = report.value;
        // TODO: Images?
  
        ReportsDB.updateReport(Report).then(() => {
          resolve();
        }).catch((error) => {
          console.error(error);
          reject();
        });

       }), "Saved successfully!", "success" , "Failed to save report!", "danger");
    }
    /*********************************************************/
  }, [Report]);


  if (!Report) {
    if (ReportTitel_OR_ID === undefined) {
      window.location.href = "/write/edit";
      return (<></>);
    }

    ReportTitel_OR_ID as string;

    if (ReportTitel_OR_ID === '') {
      window.location.href = "/write/edit";
      return (<></>);
    }

    // if not matches uuid v4 
    if (!ReportTitel_OR_ID.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
      ReportsDB.findReport.by.Title(ReportTitel_OR_ID).then(report => {
        if (!report || report.length !== 1) {
          window.location.href = "/write/edit";
        }
        window.location.href = "/write/edit/" + report[0].id;
      });
      return (<></>);
    }

    ReportsDB.getReport(ReportTitel_OR_ID).then(report => {
      if (!report) {
        window.location.href = "/write/edit";
      }
      setReport(report);
    });
  }

  return (
    <Form id="new-form">
      <FloatingLabel label="Title" className="mb-3">
        <Form.Control type="text" id="title" placeholder="Title" required />
      </FloatingLabel>
      <FloatingLabel label="Report" className="mb-3">
        <Form.Control as="textarea" id="report" />
      </FloatingLabel>
      <Form.Group className="mb-3">
        <Form.Label>Upload Files</Form.Label>
        <Form.Control type="file" id="fileUpload" multiple />
      </Form.Group>
      <div className='uploaded-files-preview form-control mb-3' id="uploaded-files-preview">
      </div>
      <div className='button-group'>
        <Button variant="primary" id="new-save" type='submit'>Save</Button>{' '}
        <Button variant="secondary" id="new-upload" type='submit'>Upload</Button>
      </div>
    </Form>
  );
};

export default Editor;