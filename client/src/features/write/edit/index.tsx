import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import IDB_Report from "../../../types/IDB_report";
import "./style.css";
import * as ReportsDB from "../../../scripts/IndexedDB/Reports"
import AddAlertLoader2 from "../../../scripts/addAlertLoader2";
import { FilesDB } from "../../../scripts/IndexedDB";
import createCard from "../../../scripts/createCard";
import FancyFileSize from "../../../scripts/fancyFileSize";


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
    const deleteBtn = document.getElementById("new-delete") as HTMLButtonElement;
    // File-Upload
    const fileUpload = document.getElementById("fileUpload") as HTMLInputElement;
    const uploadedFilesPreview = document.getElementById("uploaded-files-preview") as HTMLDivElement;

    if (!form || !title || !report || !save || !upload || !fileUpload || !uploadedFilesPreview) {
      console.error("You shouldn't be here!");
      return;
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

    deleteBtn.addEventListener("click", () => {
      deleteReport();
    });

    fileUpload.addEventListener("change", async () => {
      const files = fileUpload.files;
      if (!files) return;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await FilesDB.createFile(file, Report.id);
        if (!Report.fileIDs) Report.fileIDs = [];
        Report.fileIDs.push(result);
      }
      drawPreview();
      saveReport();
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

    // save per STRG + S
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        saveReport();
      }
    });
    /*********************************************************/

    /******************** LOCAL FUNCTIONS ********************/
    // eslint-disable-next-line
    const drawPreview = () => {
      uploadedFilesPreview.innerHTML = "";
      Report.fileIDs?.forEach((fileID: string) => {
        FilesDB.getFile(fileID).then(file => {
          if (!file) return;
          const card = createCard(file.data.name, file.data, file.data.type.split("/")[0], FancyFileSize(file.data.size));
          uploadedFilesPreview.appendChild(card);
        });
      });
    }

    const saveReport = () => {
      AddAlertLoader2("Saving report...", "info", new Promise((resolve, reject) => {
        Report.title = title.value;
        Report.report = report.value;

        ReportsDB.updateReport(Report).then(() => {
          resolve();
        }).catch((error) => {
          console.error(error);
          reject();
        });

      }), "Saved successfully!", "success", "Failed to save report!", "danger");
    }

    const deleteReport = () => {
      const ReportID = Report.id;
      AddAlertLoader2("Deleting report...", "info", new Promise((resolve, reject) => {
        FilesDB.findFile.by.reportID(ReportID).then(files => {
          files.forEach(file => {
            FilesDB.deleteFile(file.id).catch(error => {
              console.error(error);
            });
          });
          ReportsDB.deleteReport(ReportID).then(() => {
            resolve();
          }).catch(error => {
            console.error(error);
            reject();
          });
        }).catch(error => {
          console.error(error);
          reject();
        });
      }), "Deleted successfully!", "success", "Failed to delete report!", "danger").finally(() => {
        window.location.href = "/write/edit";
      });
    }
    /*********************************************************/

    /********************** LOAD CONTENT **********************/
    if (Report?.title) title.value = Report.title;
    if (Report?.report) {
      report.value = Report.report;
      report.style.height = "auto";
      report.style.height = (report.scrollHeight + 2) + "px";
    }
    if (Report?.fileIDs) drawPreview();
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
    }).catch(error => {
      window.location.href = "/write/edit";
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
        <Button variant="secondary" id="new-upload" type='submit'>Upload</Button>{' '}
        <Button variant="danger" id="new-delete" type='submit'>Delete</Button>
        <Button variant="secondary" href="/write/edit/" className="Button-Back">Back</Button>
      </div>
    </Form>
  );
};

export default Editor;