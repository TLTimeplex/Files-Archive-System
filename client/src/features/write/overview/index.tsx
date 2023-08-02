import { Button } from "react-bootstrap";
import IDB_Report from "../../../types/IDB_report";
import { FilesDB, ReportDB } from "../../../scripts/IndexedDB";
import { useState } from "react";
import "./style.scss";
import axios from "axios";
import ReportFilter, { ReportFieldSelect } from "../../../types/ReportFilter";
import AddAlert from "../../../scripts/addAlert";
import CardBox from "./cardBox";
import HorizontalDivider from "./horizontalDivider";
import IDB_File from "../../../types/iDB_file";
import { API_FileMeta } from "../../../types/API_File";
import { AlertLoader3 } from "../../../scripts/AlertLoader3";
import { ListItem } from "./ListItem";


declare global {
  interface Navigator {
    connection: any;
    mozConnection: any;
    webkitConnection: any;
  }
}

interface OverviewReport {
  Report: IDB_Report;
  isLocal: boolean;
  isRemote: boolean;
  isLocallyChanged: boolean;
  isSynced: boolean;
  canSync: boolean;
  canMerge: boolean;
  isPublic: boolean;
}

// TODO: Add Search!
// TODO: Add Synchronisation with server
export const Overview = () => {
  const [Reports, setReports] = useState<OverviewReport[]>([]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));

  const [init, setInit] = useState<boolean>(false);


  const sync = async () => {
    const filter: ReportFilter = {
      author_id: [1], //TODO: Get own ID
      archived: false,
    };

    const select: ReportFieldSelect = {
      id: true,
      title: true,
      date_modified: true,
      access: true,
    }

    let _syncedReports: any[] = [];

    if (isOnline) {
      const res = await axios.post(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report`, { filter: filter, select: select });
      if (!res.data.success) {
        console.log(res.data);
        AddAlert(res.data.message, "danger");
        return;
      }

      _syncedReports = res.data.data as any[]; //TODO: type
    }

    const _localReports = await ReportDB.getAllReports("local");
    const _remoteReports = await ReportDB.getAllReports("remote");

    let _reports: OverviewReport[] = [];

    let knownReports: string[] = [];

    _localReports.forEach((report) => {

      let _report: OverviewReport = {
        Report: report,
        isLocal: true,
        isRemote: false,
        isSynced: false,
        isLocallyChanged: false,
        canSync: false,
        canMerge: false,
        isPublic: false,
      };

      knownReports.push(report.id);

      let remote = _remoteReports.find((remoteReport: any) => remoteReport.id === report.id);
      let synced = _syncedReports.find((syncedReport: any) => syncedReport.id === report.id);

      if (remote) {
        _report.isRemote = true;
        if (remote.updatedAt < report.updatedAt) {
          _report.isLocallyChanged = true;
        }
        if (synced) {
          _report.isSynced = true;
          if (synced.date_modified > report.updatedAt && synced.date_modified > remote.updatedAt) {
            _report.canSync = true;
          }
        }
      } else if (synced) {
        _report.isSynced = true;
        if (synced.date_modified > report.updatedAt) {
          _report.canSync = true;
        }
      }

      if (synced) {
        // TODO: Check if public available
      }
      _reports.push(_report);
    });

    _remoteReports.forEach((report) => {
      if (knownReports.includes(report.id))
        return;

      knownReports.push(report.id);

      let _report: OverviewReport = {
        Report: report,
        isLocal: false,
        isRemote: true,
        isSynced: false,
        isLocallyChanged: false,
        canSync: false,
        canMerge: false,
        isPublic: false,
      };

      let synced = _syncedReports.find((syncedReport: any) => syncedReport.id === report.id);

      if (synced) {
        _report.isSynced = true;
        console.log(new Date(synced.date_modified) > new Date(report.updatedAt))
        if (new Date(synced.date_modified) > new Date(report.updatedAt)) {
          _report.canSync = true;
        }
      }

      if (synced) {
        // TODO: Check if public available
      }

      console.log(_report)

      _reports.push(_report);

    });

    _syncedReports.forEach((report) => {
      if (knownReports.includes(report.id))
        return;

      knownReports.push(report.id);

      let _report: OverviewReport = {
        Report: {
          id: report.id,
          title: report.title,
          updatedAt: new Date(report.date_modified),
        },
        isLocal: false,
        isRemote: false,
        isSynced: true,
        isLocallyChanged: false,
        canSync: true,
        canMerge: false,
        isPublic: false,
      };

      // TODO: Check if public available

      _reports.push(_report);
    });

    //sort after updatedAt date (newest first)
    _reports.sort((a, b) => {
      if (a.Report.updatedAt > b.Report.updatedAt)
        return -1;
      if (a.Report.updatedAt < b.Report.updatedAt)
        return 1;
      return 0;
    });

    setReports(_reports);
  }

  const syncReport = async (reportID: string) => {

    if (!isOnline) {
      AddAlert("You are offline", "danger");
      return;
    }

    const loader = new AlertLoader3("Receiving Report...", "info");
    loader.show();
    // Check if report exists on client
    const location = await ReportDB.existsReport(reportID, "all");
    // Check if report exists on server
    const filter: ReportFilter = {
      id: reportID,
    };

    const select: ReportFieldSelect = {
      id: true,
      date_modified: true,
    };

    const res = await axios.post(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report`, { filter: filter, select: select });

    if (!res.data.success) {
      console.log(res.data);

      loader.setText("Error: " + res.data.message);
      loader.setVariant("danger");
      loader.update();
      loader.resolve(5000);

      return;
    }

    if (res.data.data.length === 0) {

      loader.setText("Error: Report doesn't exist on server");
      loader.setVariant("danger");
      loader.update();
      loader.resolve(5000);

      return;
    }

    const extReport = res.data.data[0] as any; //TODO: type

    const local = await ReportDB.getReport(reportID, "local");
    const remote = await ReportDB.getReport(reportID, "remote");

    if (location === "all") {
      if (local === undefined || remote === undefined) {

        loader.setText("Error: Internal Error");
        loader.setVariant("danger");
        loader.update();
        loader.resolve(5000);

        return;
      }

      if (new Date(local.updatedAt) > new Date(remote.updatedAt)) {

        loader.setText("This report needs to be merged");
        loader.setVariant("warning");
        loader.update();
        loader.resolve(5000);

        return;
      }
    }

    if (location === "all" || location === "remote") {
      if (remote === undefined) {

        loader.setText("Error: Internal Error");
        loader.setVariant("danger");
        loader.update();
        loader.resolve(5000);

        return;
      }

      if (new Date(remote.updatedAt) > new Date(extReport.date_modified)) {

        loader.setText("This report doesn't need to be synced");
        loader.setVariant("warning");
        loader.update();
        loader.resolve(5000);

        return;
      }
    }

    if (location === "local") {
      if (local === undefined) {

        loader.setText("Error: Internal Error");
        loader.setVariant("danger");
        loader.update();
        loader.resolve(5000);

        return;
      }

      if (new Date(local.updatedAt) > new Date(extReport.date_modified)) {

        loader.setText("Error: Unexpected edge case! Inform an Admin!");
        loader.setVariant("danger");
        loader.update();
        loader.resolve(5000);

        return;
      }
    }

    const result = await axios.get(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report/${reportID}`);
    if (!result.data.success) {
      console.log(result.data);

      loader.setText("Error: " + res.data.message);
      loader.setVariant("danger");
      loader.update();
      loader.resolve(5000);

      return;
    }
    const report = result.data.report as IDB_Report;
    report.updatedAt = new Date(extReport.date_modified);

    try {
      if (location === null)
        await ReportDB.insertReport(report, "remote");
      else
        await ReportDB.overwriteReport(report, "remote");

      loader.setText("Report synced. Updating Files...");
      loader.setVariant("success");
      loader.update();

    } catch (err) {
      console.log(err);

      loader.setText("Error: Internal Error");
      loader.setVariant("danger");
      loader.update();
      loader.resolve(5000);

      return;
    }
    if (location === "all" || location === "local")
      await ReportDB.deleteReport(reportID, "local");

    // Load Files
    const fileIDs = report.fileIDs;
    if (fileIDs === undefined)
      return;

    let filesToLoad: Promise<string | null>[] = [];
    fileIDs.forEach((fileID: string) => {
      filesToLoad.push(FilesDB.existsFile(fileID).then((exists: boolean): string | null => { return exists ? null : fileID }));
    });

    const loadableFileIDs = (await Promise.all(filesToLoad)).filter((fileID: string | null) => fileID !== null) as string[];

    const MAX_SIZE_IN_BYTES_PER_FILE = 1000000; // 1MB //TODO: Let user choose


    for (let i = 0; i < loadableFileIDs.length; i++) {

      loader.setText("Receiving File " + (i + 1) + " of " + loadableFileIDs.length);
      loader.update();

      const fileID = loadableFileIDs[i];
      const fileExists = await FilesDB.existsFile(fileID);
      if (fileExists) {
        continue;
      }
      const fileMeta = await axios.get("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + reportID + "/file/" + fileID + "/meta");
      if (!fileMeta.data.success) {
        console.log(fileMeta.data);
        AddAlert(fileMeta.data.message, "danger");
        continue;
      }
      const fileMetaData = fileMeta.data.meta as API_FileMeta;

      if (fileMetaData.size > MAX_SIZE_IN_BYTES_PER_FILE) {
        continue;
      } // TODO: Maybe only download usable files like images and pdfs?

      const fileData: Blob = (await axios.get("/api/1/" + (localStorage.getItem("token") || sessionStorage.getItem("token")) + "/report/" + reportID + "/file/" + fileID, { responseType: "blob" })).data;

      console.log(fileData);

      const file = new File([fileData], fileMetaData.name, { type: fileMetaData.type });

      console.log(file);

      const idbFile: IDB_File = {
        id: fileID,
        data: file,
        meta: {
          linkedReport: reportID,
        }
      };

      FilesDB.insertFile(idbFile);
    }

    loader.setText("Files and Report synced");
    loader.setVariant("success");
    loader.update();
    loader.resolve(5000);

    sync();
    return;
  };

  const deleteReport = async (reportID: string) => {
    console.log("Deleting Report " + reportID);
    //TODO:
  };

  const archiveReport = async (reportID: string) => {
    console.log("Archiving Report " + reportID);
    //TODO:
  };

  if (!init) {
    sync();
    setInit(true);
  }

  //const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  return (
    <>
      <h1>Select Report to edit</h1>
      <table className="Overview">
        <tbody>
          {
            Reports.map((report, index) => {
              return (
                <ListItem key={index} Title={report.Report.title || ""} isArchived={false} statusSet={{ isLocallyAvailable: report.isLocal || report.isRemote, isSynced: report.isSynced, isPublic: false, hasConflicts: (!report.isSynced && report.isRemote) }} date={report.Report.updatedAt} content={report.Report.report?.slice(0, 50) + "..."} viewCallback={() => document.location.href = "/report/edit/" + report.Report.id} deleteCallback={/* TODO: Check if is own */ () => { deleteReport(report.Report.id) }} syncCallback={report.canSync ? () => syncReport(report.Report.id) : undefined} mergeCallback={report.canMerge ? () => {/*TODO:*/ } : undefined} archiveCallback={() => archiveReport(report.Report.id)} />
              );
            })
          }
        </tbody>
      </table>
    </>
  );
};

export default Overview;