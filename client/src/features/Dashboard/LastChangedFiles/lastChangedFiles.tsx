import { ArchiveDB } from '../../../scripts/IndexedDB';
import { IDB_Archive } from '../../../types/IDB_Archive';
import ReportFilter, { ReportFieldSelect } from '../../../types/ReportFilter';
import './lastChangedFiles.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddAlert from '../../../scripts/addAlert';


async function getLastReportsSorted(): Promise<IDB_Archive[]> {
  const filter: ReportFilter = {
    archived: true,
  }

  const select: ReportFieldSelect = {
    title: true,
    author_id: true,
    date_modified: true,
  }

  const req = axios.post(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report`, { filter: filter, select: select });

  const allArchive: IDB_Archive[] = await ArchiveDB.getAllArchive();

  const res = await req;
  if (!res.data.success) {
    console.log(res.data);
    AddAlert(res.data.message, "danger");
  } else {
    const reports = res.data.data.map((report: any) => {
      console.log(report);
      return {
        id: report.id,
        data: {
          title: report.title,
          report: report.author_id,
        },
        meta: {
          date: report.date_modified,
        }
      }
    }) as IDB_Archive[];

    allArchive.push(...reports);
  }

  return (allArchive.sort((a, b) => {
    const aDate = new Date(a.meta.date);
    const bDate = new Date(b.meta.date);
    return bDate.getTime() - aDate.getTime();
  }));
}

export const LastFileChanged = () => {
  const [init, setInit] = useState<boolean>(false);
  const [lastUpdatedReports, setReport] = useState<IDB_Archive[]>([]);
  const limit = 5;


  useEffect(() => {
    if (init) return;
    getLastReportsSorted().then((reports) => {
      setReport(reports);
      setInit(true);
    });
  });

  return (<div className='Feed'>
    <p className='HeadLine'>Archive Feed</p>
    <div>
      {lastUpdatedReports.map((report, index) => {
        if (index >= limit) return ("");
        return (
          <div className='SingleReport' onClick={() => document.location.href = "/archive/" + report.id} title={report.data.title} key={index}>
            <p className='title'>{report.data.title}</p>
            <p className='discription'><span className='discriptionBold'>Description:</span><br></br>
              <span className='discriptionItalic'>{report.data.report}</span>
            </p>
            <p className='date'>{new Date(report.meta.date).toLocaleDateString()}</p>
          </div>
        )
      })}
    </div>
  </div>
  );
};