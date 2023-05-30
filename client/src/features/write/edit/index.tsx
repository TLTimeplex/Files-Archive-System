import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import IDB_Report from "../../../types/IDB_report";
import "./style.css";
import * as ReportsDB from "../../../scripts/IndexedDB/Reports"
import AddAlertLoader2 from "../../../scripts/addAlertLoader2";
import { FilesDB } from "../../../scripts/IndexedDB";
import createCard from "../../../scripts/createCard";
import FancyFileSize from "../../../scripts/fancyFileSize";
import axios from "axios";
import AddAlert from "../../../scripts/addAlert";
import { API_FileMeta } from "../../../types/API_File";


export const Editor = () => {
  const { ReportTitel_OR_ID } = useParams();

  const [Report, setReport] = useState<IDB_Report>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [init, setInit] = useState(false);

  useEffect(() => {
    if (!Report || !init) return;

    /********************** HTML ELEMENTS *********************/
    // Text-Fields
    const title = document.getElementById("title") as HTMLInputElement;
    const report = document.getElementById("report") as HTMLTextAreaElement;

    if (!title || !report) {
      console.error("You shouldn't be here!");
      return;
    }
    /*********************************************************/

    /********************* EVENT LISTENER *********************/
    // Auto resize textarea + 1 time on load
    report.addEventListener("keydown", () => autoResize());

    report.addEventListener("click", () => autoResize());

    report.addEventListener("change", () => autoResize());

    // save per STRG + S
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        saveReport();
      }
    });
    /*********************************************************/

    /******************** LOCAL FUNCTIONS ********************/
    const autoResize = () => {
      report.style.height = "auto";
      report.style.height = (report.scrollHeight + 2) + "px";
    }
    /*********************************************************/

    /********************** LOAD CONTENT **********************/
    if (Report?.title) title.value = Report.title;
    if (Report?.report) {
      report.value = Report.report;
      autoResize()
    }
    if (Report?.fileIDs) drawPreview();
    /*********************************************************/

  },
    // eslint-disable-next-line
    [init]);


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
      setInit(true);
    }).catch(error => {
      window.location.href = "/write/edit";
    });
    return (<></>);
  }

  const saveReport = async (overwrite?: IDB_Report) => {
    await AddAlertLoader2("Saving report...", "info", new Promise((resolve, reject) => {
      const title = document.getElementById("title") as HTMLInputElement;
      const report = document.getElementById("report") as HTMLTextAreaElement;

      const titelValue = title.value;
      const reportValue = report.value;

      const newReport = { ...Report, title: titelValue, report: reportValue, updatedAt: new Date(), ...overwrite }

      setReport(newReport);

      ReportsDB.updateReport(newReport).then(() => {
        resolve();
      }).catch((error) => {
        console.error(error);
        reject();
      });

    }), "Saved successfully!", "success", "Failed to save report!", "danger");
  }

  const deleteReport = () => {
    AddAlertLoader2("Deleting report...", "info", new Promise((resolve, reject) => {
      FilesDB.findFile.by.reportID(Report.id).then(files => {
        files.forEach(file => {
          FilesDB.deleteFile(file.id).catch(error => {
            console.error(error);
          });
        });
        
        if (Report.uploaded) {
          axios.delete("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id).then(result => {
            if (!result.data.success) {
              AddAlert(result.data.message, "danger");
              reject();
              return;
            }
          });
          ReportsDB.deleteReport(Report.id).then(() => {
            resolve();
          }).catch(error => {
            console.error(error);
            reject();
          });
          return;
        }

        ReportsDB.deleteReport(Report.id).then(() => {
          resolve();
        }).catch(error => {
          console.error(error);
          reject();
        });
      });
    }), "Deleted successfully!", "success", "Failed to delete report!", "danger").then(() => {
      window.location.href = "/report";
    }).finally(() => { });
  }

  const syncReport = async () => {
    const shadowReport = createShadowReport();
    if (Report.uploaded) {
      const result = await axios.patch("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id, shadowReport);
      if (!result.data.success) {
        AddAlert(result.data.message, "danger");
        return;
      }
    }
    else {
      const result = await axios.put("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report", shadowReport);
      if (!result.data.success) {
        AddAlert(result.data.message, "danger");
        return;
      }
    }

    Report.fileIDs?.forEach(async (fileID) => {
      const file = await FilesDB.getFile(fileID);
      if (!file) return;
      if (file.meta.uploaded !== 0) return;

      var formData = new FormData();
      formData.append("id", file.id);
      formData.append("data", file.data);
      formData.append("meta", JSON.stringify(file.meta));

      const result = await axios.put("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id + "/file", formData); //TODO: add data
      if (!result.data.success) {
        AddAlert(result.data.message, "danger");
        return;
      }
      await FilesDB.updateFileMeta(file.id, { ...file.meta, uploaded: 1 });
    });

    AddAlert("Report saved and uploaded!", "success");
    setReport({ ...shadowReport, uploaded: true });
    await saveReport({ ...shadowReport, uploaded: true });
  }

  const addFiles = async () => {
    const fileUpload = document.getElementById("fileUpload") as HTMLInputElement;

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
  }

  const drawPreview = async () => { //TODO: If files are missing try to load them from server
    const uploadedFilesPreview = document.getElementById("uploaded-files-preview") as HTMLDivElement;

    uploadedFilesPreview.innerHTML = "";

    const awaitFiles: Promise<string | void>[] = [];

    Report.fileIDs?.forEach((fileID: string) => {
      awaitFiles.push(new Promise(async (resolve, reject) => {
        FilesDB.getFile(fileID).then(file => {
          if (!file) return;
          const card = createCard(file.data.name, file.data, file.data.type.split("/")[0], FancyFileSize(file.data.size), () => removeFile(fileID));
          uploadedFilesPreview.appendChild(card);
          resolve(fileID);
        }).catch(error => {
          if(Report.uploaded) {
            // Get meta of file from server
            axios.get("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id + "/file/" + fileID + "/meta").then(result => {
              if(!result.data.success) {
                AddAlert(result.data.message, "danger");
                resolve();
                return;
              }
              const fileMeta = result.data.meta as API_FileMeta;
              if(!fileMeta || !fileMeta.name || !fileMeta.type || !fileMeta.size) {
                AddAlert("Failed to load file meta!", "danger");
                resolve();
                return;
              }
              // Get file from server
              axios.get("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id + "/file/" + fileID, {responseType: 'blob'}).then(res => {
                if(res.data.success === false) {
                  AddAlert(res.data.message, "danger");
                  resolve();
                  return;
                }
                const blob = new Blob([res.data], {type: fileMeta.type});
                const fileR = new File([blob], fileMeta.name, {type: fileMeta.type});
                const card = createCard(fileR.name, fileR, fileR.type.split("/")[0], FancyFileSize(fileR.size), () => removeFile(fileID));
                uploadedFilesPreview.appendChild(card);
                FilesDB.insertFile({id: fileID, data: fileR, meta: { uploaded: 1, uploadedAt: new Date(), linkedReport: Report.id }})
                .catch(error => { console.error(error); })
                .finally(() => {resolve(fileID)});
              });
            });
          }else {
            AddAlert("Failed to load file!", "danger");
            resolve();
          }
        });
      }))
    });

    await Promise.all(awaitFiles).then((remaining) => {
      saveReport({ ...Report, fileIDs: remaining.filter(id => id !== undefined) as string[] });
    });
  }

  const removeFile = async (fileID: string) => {
    if (!Report.fileIDs) return;
    const size = Report.fileIDs.length;
    const remainingFileIDs = Report.fileIDs.filter(id => id !== fileID);
    if (size === remainingFileIDs.length) return;
    FilesDB.deleteFile(fileID).catch(error => { console.error(error); });
    await saveReport({ ...Report, fileIDs: remainingFileIDs });
    drawPreview();
  }

  const createShadowReport = (overwrite?: IDB_Report): IDB_Report => {
    const title = document.getElementById("title") as HTMLInputElement;
    const report = document.getElementById("report") as HTMLTextAreaElement;

    const titelValue = title.value;
    const reportValue = report.value;

    const newReport = { ...Report, title: titelValue, report: reportValue, updatedAt: new Date(), ...overwrite }

    return newReport;
  }

  return (
    <Form id="new-form" onSubmit={(event) => event.preventDefault()}>
      <FloatingLabel label="Title" className="mb-3">
        <Form.Control type="text" id="title" placeholder="Title" required />
      </FloatingLabel>
      <FloatingLabel label="Report" className="mb-3">
        <Form.Control as="textarea" id="report" />
      </FloatingLabel>
      <Form.Group className="mb-3">
        <Form.Label>Upload Files</Form.Label>
        <Form.Control type="file" id="fileUpload" multiple onChange={addFiles} />
      </Form.Group>
      <div className='uploaded-files-preview form-control mb-3' id="uploaded-files-preview">
      </div>
      <div className='button-group'>
        <Button variant="primary" id="new-save" type='submit' onClick={() => saveReport()}>Save</Button>{' '}
        <Button variant={Report?.uploaded ? "success" : "outline-success"} id="new-sync" type='submit' onClick={syncReport}>Sync</Button>{' '}
        {Report?.uploaded ? <Button variant="warning" id="new-archive" type='submit'>Archive</Button> : <></>}{' '}
        <Button variant="danger" id="new-delete" onClick={() => setShowDeleteModal(true)}>Delete</Button>
        <Button variant="secondary" href="/report" className="Button-Back">Back</Button>
      </div>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete report</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are your sure to delete this report permanently?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteReport}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
};

export default Editor;