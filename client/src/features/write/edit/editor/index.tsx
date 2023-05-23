import { useEffect } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import IDB_Report from "../../../../types/IDB_report";
import "./style.css";

export const Editor = () => {
  const { ReportTitel_OR_ID } = useParams();

  let Report: IDB_Report | undefined;

  useEffect(() => {
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

    if(!form || !title || !report || !save || !upload || !fileUpload || !uploadedFilesPreview) {
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
      //TODO: Box up the data and save it to the database
    });

    upload.addEventListener("click", () => {
      //TODO: Upload the files to the database after saving the report 
    });

    fileUpload.addEventListener("change", () => {
      const files = fileUpload.files;
      // TODO:
      // Save the files to the database
      // Redraw the preview
    });

    // Auto resize textarea
    report.addEventListener("keydown", (event) => {
      report.style.height = "auto";
      report.style.height = (report.scrollHeight + 2) + "px";
    });
    /*********************************************************/

    /******************** LOCAL FUNCTIONS ********************/
    const drawPreview = (/* TODO: */) => {
      // TODO:
    }
    /*********************************************************/
  }, [Report]);

  if (ReportTitel_OR_ID === undefined) {
    window.location.href = "/write/edit";
    return (<></>);
  }

  ReportTitel_OR_ID as string;

  if (ReportTitel_OR_ID === '') {
    window.location.href = "/write/edit";
    return (<></>);
  }

  // if matches uuid v4 
  if (ReportTitel_OR_ID.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
    // TODO: Check if ID corresponds to a report in the database
    //       If not, redirect to /write/edit
    //       If yes, Report = Report from database
    
    // TEMPORARY
    Report =  {
      id: ReportTitel_OR_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    // TEMPORARY

  } else {
    // TODO: Check if Titel corresponds to a report in the database
    //       If not, redirect to /write/edit
    //       If yes, redirect to /write/edit/:id
    //       If multiple matches, redirect to /write/edit

    // TEMPORARY
    window.location.href = "/write/edit";
    // TEMPORARY

    return (<></>);
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