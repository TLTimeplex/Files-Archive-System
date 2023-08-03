import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import IDB_Report from "../../../types/IDB_report";
import "./style.css";
import * as ReportsDB from "../../../scripts/IndexedDB/Reports"
import AddAlertLoader2 from "../../../scripts/addAlertLoader2";
import { FilesDB } from "../../../scripts/IndexedDB";
import axios from "axios";
import AddAlert from "../../../scripts/addAlert";
import { API_FileMeta } from "../../../types/API_File";
import IDB_File from "../../../types/iDB_file";
import PreviewBox from "../../../compnents/PreviewBox";


export const Editor = () => {
  const { ReportTitel_OR_ID } = useParams();

  const [Report, setReport] = useState<IDB_Report>();
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [init, setInit] = useState(false);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [Files, setFiles] = useState<IDB_File[]>([]);

  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));

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
    /*********************************************************/

  },
    // eslint-disable-next-line
    [init]);

  const drawPreview = async () => {
    const awaitFiles: Promise<IDB_File | undefined>[] = [];

    Report?.fileIDs?.forEach((fileID: string) => {
      awaitFiles.push(new Promise<IDB_File | undefined>((resolve, reject) => {
        FilesDB.getFile(fileID).then(file => {
          resolve(file);
        }).catch(error => {
          resolve(undefined);
        });
      }));
    });
    await Promise.all(awaitFiles).then(files => {
      let Files: IDB_File[] = [];
      let missingFile: boolean = false;
      for (const file of files) {
        if (file) Files.push(file);
        else missingFile = true;
      }
      setFiles(Files);
      if (missingFile) {
        AddAlert("Some files are missing! Syncing might solve the problem", "warning");
      }
    });
  }

  useEffect(() => {
    if (!Report || !init) return;
    drawPreview();
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
      ReportsDB.findReport.by.Title(ReportTitel_OR_ID, "all").then(report => {
        if (!report || report.length !== 1) {
          window.location.href = "/write/edit";
        }
        window.location.href = "/write/edit/" + report[0].id;
      });
      return (<></>);
    }
    ReportsDB.getReport(ReportTitel_OR_ID, "all").then(report => {
      if (!report) {
        window.location.href = "/write/edit";
        return;
      }
      ReportsDB.existsReport(report.id, "remote").then(exists => {
        if (exists === "remote") {
          setIsUploaded(true);
        }
      });
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

      // Check if any value changed
      if (newReport.title === Report.title && newReport.report === Report.report && newReport.fileIDs === Report.fileIDs && newReport.description === Report.description) {
        AddAlert("Nothing changed!", "info");
        resolve();
        return;
      }

      setReport(newReport);

      ReportsDB.existsReport(newReport.id, "local").then((exists) => {
        if (exists) {
          ReportsDB.updateReport(newReport, "local").then(() => {
            resolve();
          }).catch((error) => {
            console.error(error);
            reject();
          });
        }
        else {
          ReportsDB.insertReport(newReport, "local").then(() => {
            resolve();
          }).catch((error) => {
            console.error(error);
            reject();
          });
        }
      }).catch((error) => {
        console.error(error);
        reject();
      });

    }), "Saved successfully!", "success", "Failed to save report!", "danger");
  }

  const deleteReport = async () => {
    if (!navigator.onLine && isUploaded) {
      AddAlert("You need to be online to delete a report!", "danger");
      return;
    }

    AddAlertLoader2("Deleting report...", "info", new Promise((resolve, reject) => {
      ReportsDB.existsReport(Report.id, "remote").then(exists => { //TODO: Take Exists and seperate in two functions (exists, locate)
        if (exists === "remote") {
          axios.delete("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id).then(result => {
            if (!result.data.success) {
              AddAlert(result.data.message, "danger");
              reject();
              return;
            }
          });
        }
        FilesDB.findFile.by.reportID(Report.id).then(files => {
          files.forEach(file => {
            FilesDB.deleteFile(file.id).catch(error => {
              console.error(error);
            });
          });
          ReportsDB.deleteReport(Report.id, "all").then(() => {
            resolve();
          }).catch(error => {
            console.error(error);
            reject();
          });
        });
      });
    }), "Deleted successfully!", "success", "Failed to delete report!", "danger").then(() => {
      window.location.href = "/report";
    }).finally(() => { });
  }

var localIsUploaded = isUploaded;

  const syncReport = async () => {
    if (!navigator.onLine) {
      AddAlert("You need to be online to sync a report!", "danger");
      return;
    }
    // Save report temporary
    const shadowReport = createShadowReport();

    // If report is not uploaded, create a new one
    if (!localIsUploaded) {
      const result = await axios.put("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report", shadowReport);
      if (!result.data.success) {
        AddAlert(result.data.message, "danger");
        return;
      }
      await ReportsDB.insertReport(shadowReport, "remote");
      await ReportsDB.deleteReport(shadowReport.id, "local");
      setIsUploaded(true);
      localIsUploaded = true;
      syncReport();
      return;
    }

    if (!Report.fileIDs)
      Report.fileIDs = [];

    // Upload any missing images and delete removed images
    const uploadedFilesResult = await axios.get("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id + "/file");
    if (!uploadedFilesResult.data.success) {
      AddAlert(uploadedFilesResult.data.message, "danger");
      return;
    }
    const uploadedFiles = uploadedFilesResult.data.fileIDs as string[];

    const result = await axios.patch("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id, shadowReport);
    if (!result.data.success) {
      AddAlert(result.data.message, "danger");
      return;
    }
    
    let promises: Promise<void>[] = [];

    let needToUpload: string[] = [];
    let needToDelete: string[] = [];

    Report.fileIDs.forEach((fileID) => {
      if (!uploadedFiles.includes(fileID))
        needToUpload.push(fileID);
    })

    uploadedFiles.forEach((fileID) => {
      if (!Report.fileIDs?.includes(fileID))
        needToDelete.push(fileID);
    })

    // Download any missing images
    Report.fileIDs.forEach((fileID) => {
      promises.push(new Promise((resolve, reject) => {
        FilesDB.existsFile(fileID).then((exists) => {
          if (exists) {
            resolve();
            return;
          }
          axios.get("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id + "/file/" + fileID + "/meta")
            .then((result) => {
              if (!result.data.success) {
                AddAlert(result.data.message, "danger");
                resolve();
                return;
              }
              const fileMeta = result.data.meta as API_FileMeta;

              axios.get("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id + "/file/" + fileID, { responseType: "blob" })
                .then((result) => {
                  if (result.data.success === false) {
                    AddAlert(result.data.message, "danger");
                    resolve();
                    return;
                  }
                  const data = result.data as Blob;

                  const file = new File([data], fileMeta.name, { type: fileMeta.type });

                  const idbFile: IDB_File = {
                    id: fileID,
                    data: file,
                    meta: {
                      linkedReport: Report.id //TODO: ?
                    }
                  }

                  FilesDB.insertFile(idbFile).then(() => {
                    resolve();
                    return;
                  }).catch((err) => {
                    console.log(err);
                    resolve();
                  })
                }).catch((err) => {
                  console.log(err);
                  resolve();
                })
            })
            .catch((err) => {
              console.log(err);
              resolve();
            })
        }).catch((err) => {
          console.log(err);
          resolve();
        })
      }))
    })

    needToUpload.forEach((fileID) => {
      promises.push(new Promise((resolve, reject) => {
        FilesDB.getFile(fileID).then((file) => {
          if (!file) {
            AddAlert("Couldn't load file from storage!", "danger");
            reject();
            return;
          }

          var formData = new FormData();
          formData.append("id", file.id);
          formData.append("data", file.data);
          formData.append("meta", JSON.stringify(file.meta));

          axios.put("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id + "/file", formData).then((result) => {
            if (!result.data.success) {
              AddAlert(result.data.message, "danger");
              reject();
              return;
            }
            resolve();
          }).catch((err) => {
            console.log(err);
            reject();
            return;
          })
        }).catch(err => {
          console.log(err);
          AddAlert("Couldn't load file from storage!", "danger");
          Report.fileIDs = Report.fileIDs?.filter((id) => id !== fileID);
          reject();
        })
      }))
    })

    needToDelete.forEach((fileID) => {
      promises.push(new Promise((resolve, reject) => {
        axios.delete("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id + "/file/" + fileID).then((result) => {
          if (!result.data.success) {
            AddAlert(result.data.message, "danger");
            reject();
            return;
          }
          FilesDB.deleteFile(fileID).then(() => {
            resolve();
            return;
          }).catch((err) => {
            console.log(err);
            resolve();
            return;
          })
        }).catch((err) => {
          console.log(err);
          reject();
          return;
        })
      }))
    })

    await Promise.all(promises).catch((err) => { console.log(err) });

    AddAlert("Report saved and uploaded!", "success");
    if (isUploaded) {
      await ReportsDB.updateReport({ ...shadowReport, updatedAt: new Date() }, "remote");
    }
    else {
      await ReportsDB.insertReport({ ...shadowReport, updatedAt: new Date() }, "remote");
      setIsUploaded(true);
    }
  }

  const addFiles = async () => {
    const fileUpload = document.getElementById("fileUpload") as HTMLInputElement;

    const files = fileUpload.files;
    let fileIDs: string[] = [];
    Report.fileIDs?.forEach(id => fileIDs.push(id));
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await FilesDB.createFile(file, Report.id);
      if (fileIDs === undefined) fileIDs = [];
      fileIDs.push(result);
    }
    saveReport({ ...Report, fileIDs: fileIDs });
  }

  const removeFile = async (fileID: string) => {
    if (!Report.fileIDs) return;
    const size = Report.fileIDs.length;
    const remainingFileIDs = Report.fileIDs.filter(id => id !== fileID);
    if (size === remainingFileIDs.length) return;
    FilesDB.deleteFile(fileID).catch(error => { console.error(error); });
    await saveReport({ ...Report, fileIDs: remainingFileIDs });
  }

  const createShadowReport = (overwrite?: IDB_Report): IDB_Report => {
    const title = document.getElementById("title") as HTMLInputElement;
    const report = document.getElementById("report") as HTMLTextAreaElement;

    const titelValue = title.value;
    const reportValue = report.value;

    const newReport = { ...Report, title: titelValue, report: reportValue, updatedAt: new Date(), ...overwrite }

    return newReport;
  }

  const archiveReport = async () => {
    await syncReport();
    const res = await axios.get("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + Report.id + "/archive");
    if (!res.data.success) {
      AddAlert(res.data.message, "danger");
      return;
    }
    //TODO: Remove files from storage
    await ReportsDB.deleteReport(Report.id, "all");
    AddAlert("Report archived!", "success");
    window.location.href = "/reports";
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
      <PreviewBox files={Files} removeCallback={removeFile} />
      <div className='button-group'>
        <Button variant="primary" id="new-save" type='submit' onClick={() => saveReport()}>Save</Button>{' '}
        {isOnline ? <Button variant={isUploaded ? "success" : "outline-success"} id="new-sync" type='submit' onClick={syncReport}>Sync</Button> : <></>}{' '}
        {isUploaded && isOnline ? <Button variant="warning" id="new-archive" type='submit' onClick={() => archiveReport()}>Archive</Button> : <></>}{' '}
        {isOnline || (!isOnline && !isUploaded) ? <Button variant="danger" id="new-delete" onClick={() => setShowDeleteModal(true)}>Delete</Button> : <></>}
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