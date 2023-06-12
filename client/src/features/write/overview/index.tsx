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


declare global {
  interface Navigator {
    connection: any;
    mozConnection: any;
    webkitConnection: any;
  }
}

// TODO: Add Search!
// TODO: Add Synchronisation with server
export const Overview = () => {
  const [LocalReports, setLocalReports] = useState<IDB_Report[]>([]);
  const [RemoteReports, setRemoteReports] = useState<IDB_Report[]>([]);
  const [RemoteChangedReports, setRemoteChangedReports] = useState<IDB_Report[]>([]);

  const [SyncReports, setSyncReports] = useState<IDB_Report[]>([]);
  const [MergeReports, setMergeReports] = useState<IDB_Report[]>([]); //TODO:

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

    let localReports: IDB_Report[] = [];
    let remoteReports: IDB_Report[] = [];
    let remoteChangedReports: IDB_Report[] = [];
    let syncReports: IDB_Report[] = [];

    let mergeReports: IDB_Report[] = [];

    //TODO: REDO! Reverse order

    _localReports.forEach((localReport: IDB_Report) => {
      const remoteReport = _remoteReports.find((remoteReport: IDB_Report) => remoteReport.id === localReport.id);

      if (remoteReport !== undefined) {
        if (new Date(localReport.updatedAt) < new Date(remoteReport.updatedAt)) {
          ReportDB.deleteReport(localReport.id, "local");
        } else {
          remoteChangedReports.push(remoteReport);
        }
        return;
      }

      const syncedReport = _syncedReports.find((syncedReport: any) => syncedReport.id === localReport.id);
      if (syncedReport !== undefined) {
        if (new Date(localReport.updatedAt) < new Date(syncedReport.date_modified)) {
          ReportDB.deleteReport(localReport.id, "local");
        } else {
          mergeReports.push(localReport);
        }
        return;
      }

      localReports.push(localReport);
    });

    _remoteReports.forEach((remoteReport: IDB_Report) => {
      const localReport = _localReports.find((localReport: IDB_Report) => remoteReport.id === localReport.id);

      if (localReport !== undefined) {
        return;
      }

      const syncedReport = _syncedReports.find((syncedReport: any) => syncedReport.id === remoteReport.id);
      if (syncedReport !== undefined) {
        if (new Date(remoteReport.updatedAt) < new Date(syncedReport.date_modified)) {
          syncReports.push(remoteReport);
        }
      }

      remoteReports.push(remoteReport);
    });

    _syncedReports.forEach((syncedReport: any) => {
      const localReport = _localReports.find((localReport: IDB_Report) => syncedReport.id === localReport.id);
      const remoteReport = _remoteReports.find((remoteReport: IDB_Report) => syncedReport.id === remoteReport.id);

      if (localReport !== undefined || remoteReport !== undefined) {
        return;
      }

      syncReports.push({
        id: syncedReport.id,
        title: syncedReport.title,
        updatedAt: syncedReport.date_modified
      });
    });

    setLocalReports(localReports);
    setRemoteReports(remoteReports);
    setRemoteChangedReports(remoteChangedReports);
    setSyncReports(syncReports);
    setMergeReports(mergeReports);
  };

  const syncReport = async (reportID: string) => {

    if(!isOnline){
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


  if (!init) {
    sync();
    setInit(true);
  }

  //const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  return (
    <>
      <h1>Select Report to edit</h1>
      {LocalReports.length !== 0 ?
        <>
          <HorizontalDivider title="Local" />
          <CardBox reports={LocalReports} type="local" />
        </>
        : null}

      {RemoteReports.length !== 0 ?
        <>
          <HorizontalDivider title="Remote" />
          <CardBox reports={RemoteReports} type="remote" />
        </>
        : null}
      {RemoteChangedReports.length !== 0 ?
        <>
          <HorizontalDivider title="Remote (Changed)" />
          <CardBox reports={RemoteChangedReports} type="remoteChanged" />
        </>
        : null}
      {SyncReports.length !== 0 ?
        <>
          <HorizontalDivider title="Remote (Need Sync)" />
          <CardBox reports={SyncReports} type="sync" sync={syncReport} />
        </>
        : null}
      {MergeReports.length !== 0 ?
        <>
          <HorizontalDivider title="Remote (Need Merge)" />
          <CardBox reports={MergeReports} type="merge" />
        </>
        : null}
      <hr />
      <div className="AddButtonBox">
        <Button variant="secondary" href="/report/new" className="AddButton">New Report</Button>
      </div>
      <h1>{ }</h1>
    </>
  );
};

export default Overview;