import { useEffect, useState } from "react";
import { IDB_Archive } from "../../types/IDB_Archive";
import { ArchiveDB } from "../../scripts/IndexedDB";
import { useParams } from "react-router-dom";
import axios from "axios";
import IDB_Report from "../../types/IDB_report";
import ReportFilter, { ReportFieldSelect } from "../../types/ReportFilter";
import { API_FileMeta } from "../../types/API_File";
import IDB_File from "../../types/iDB_file";
import { FloatingLabel, Spinner, Form, Button } from "react-bootstrap";

export const ViewArchive = () => {

  const { archiveID } = useParams();

  const [report, setReport] = useState<IDB_Archive>();

  if (!archiveID) {
    window.location.href = "/archive";
  }

  useEffect(() => {
    if (report || !archiveID)
      return;

    // Check if the report is in the database
    ArchiveDB.getArchive(archiveID).then((archive: IDB_Archive) => {
      if (!archive) {
        getArchive();
        return;
      }
      setReport(archive);
    }).catch((err) => {
      console.log(err);
      getArchive();
    });
  });

  useEffect(() => {
    if (!report)
      return;
    const title = document.getElementById("title") as HTMLInputElement;
    const content = document.getElementById("report") as HTMLInputElement;

    title.value = report.data.title;
    content.value = report.data.report;


    content.style.height = "auto";
    content.style.height = (content.scrollHeight + 2) + "px";
  }, [report]);

  const getArchive = () => {
    if (report || !archiveID)
      return;

    // If not, try to get it from the server
    const filter: ReportFilter = {
      archived: true,
      id: archiveID,
    };

    const select: ReportFieldSelect = {
      "id": true,
      "title": true,
      "author_id": true,
      "author_name": true,
      "date_modified": true,
    }

    axios.post(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report`, { filter: filter, select: select }).then((res) => {
      if (!res.data.success) {
        console.log(res.data.message);
        window.location.href = "/archive";
        return;
      }


      const reportMeta: any = res.data.data[0];

      console.log(reportMeta)


      axios.get(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report/${archiveID}`).then((res) => {
        console.log(res.data)
        if (!res.data.success) {
          console.log(res.data.message);
          window.location.href = "/archive";
          return;
        }

        const report: IDB_Report = res.data.report;

        let promises: Promise<IDB_File>[] = [];

        report.fileIDs?.forEach(fileID => {
          promises.push(new Promise((resolve, reject) => {
            axios.get("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + archiveID + "/file/" + fileID + "/meta").then((res) => {
              if (!res.data.success) {
                console.log(res.data.message);
                reject(res.data.error);
                return;
              }

              const fileMetaData: API_FileMeta = res.data.meta;

              axios.get("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + archiveID + "/file/" + fileID, { responseType: "blob" }).then((res) => {
                const fileData: Blob = res.data;

                const file = new File([fileData], fileMetaData.name, { type: fileMetaData.type });

                console.log(file);

                const idbFile: IDB_File = {
                  id: fileID,
                  data: file,
                  meta: {
                    linkedReport: archiveID,
                  }
                }

                resolve(idbFile);
              }).catch((err) => {
                console.log(err);
                reject(err);
              });
            }).catch((err) => {
              console.log(err);
              reject(err);
            });
          }));
        });

        Promise.all(promises).then((files) => {
          if (!report.title || !report.report)
            return;
          const archive: IDB_Archive = {
            id: archiveID,
            data: {
              title: report.title,
              report: report.report,
              description: report.description,
              files: files || [],
            },
            meta: {
              authorID: reportMeta.author_id,
              author: reportMeta.author_name,
              date: reportMeta.date_modified,
              fileIDs: report.fileIDs || [],
            }
          }
          console.log(archive);

          setReport(archive);
        }).catch((err) => {
          console.log(err);
          window.location.href = "/archive";
        });


      }).catch((err) => {
        console.log(err);
        window.location.href = "/archive";
      });
    }).catch((err) => {
      console.log(err);
      window.location.href = "/archive";
    });
  }


  const saveArchived = () => {
    if (!report)
      return;
    //TODO:
    //TODO: Check if already saved
  }

  return (
    <>
      {report ?
        <Form id="new-form" onSubmit={(event) => event.preventDefault()}>
          <FloatingLabel label="Title" className="mb-3">
            <Form.Control type="text" id="title" placeholder="Title" disabled />
          </FloatingLabel>
          <FloatingLabel label="Report" className="mb-3">
            <Form.Control as="textarea" id="report" disabled />
          </FloatingLabel>
          <div className='uploaded-files-preview form-control mb-3' id="uploaded-files-preview">
          </div>
          <div className='button-group'>
            <Button variant="primary" id="new-save" type='submit' onClick={() => saveArchived()}>Save</Button>{' '}
            <Button variant="secondary" href="/archive" className="Button-Back">Back</Button>
          </div>
        </Form>
        :
        <div className="LoadingBox">
          <Spinner animation="border" variant="primary" className='LoadingSpinner' />
          <h2>Loading archived Report...</h2>
        </div>
      }
    </>
  );
};

export default ViewArchive;