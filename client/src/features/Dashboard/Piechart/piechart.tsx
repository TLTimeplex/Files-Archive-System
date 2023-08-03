import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './piechart.css'
import { ReportDB } from '../../../scripts/IndexedDB';
import axios from 'axios';
import ReportFilter, { ReportFieldSelect } from "../../../types/ReportFilter";
import IDB_Report from "../../../types/IDB_report";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

async function getNumberOfReports() {
  let online: boolean = navigator.onLine;

  let numberOfLocalReports: number = 0;
  const _localReports: IDB_Report[] = await ReportDB.getAllReports("local");
  let localReports: IDB_Report[] = [];

  let numberOfRemoteReports: number = 0;
  const remoteReports: IDB_Report[] = await ReportDB.getAllReports("remote");

  let numberOfUnsyncReports: number = 0;

  _localReports.forEach((localReport: IDB_Report) => {
    let remote: any = remoteReports.find((remote) => remote.id === localReport.id);
    if (remote === undefined) {
      localReports.push(localReport);
    }
  });
  numberOfLocalReports = localReports.length;

  numberOfRemoteReports = remoteReports.length;

  if (online) {
    const filter: ReportFilter = {
      author_id: [1],
      archived: false,
    };

    const select: ReportFieldSelect = {
      id: true,
      title: true,
      date_modified: true,
    }

    let allSyncedReports: IDB_Report[] = [];

    const res = await axios.post(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report`, { filter: filter, select: select });
    if (!res.data.success) {
      console.log("Not possible to get Data from Server.");
      return;
    }
    allSyncedReports = res.data.data as IDB_Report[];


    let unsyncReports: IDB_Report[] = [];

    allSyncedReports.forEach((sync: IDB_Report) => {
      let local: any = localReports.find((local) => local.id === sync.id)
      let remote: any = remoteReports.find((remote) => remote.id === sync.id);

      if ((local !== undefined) && (remote === undefined)) {
        console.log("Error");
        return;
      }
      if ((local === undefined) && (remote === undefined)) {
        unsyncReports.push(sync);
      }
    });
    numberOfUnsyncReports = unsyncReports.length;
  }

  return online ? [numberOfLocalReports, numberOfRemoteReports, numberOfUnsyncReports] : [numberOfLocalReports, numberOfRemoteReports];
}

export const Piechart = () => {
  const [data, setData] = useState<any>(); //TODO: data define as Interface => but Doughnut need "ChartData<"doughnut", number[], unknown>" as input var
  const [init, setInit] = useState<boolean>(false);
  const ChartOptions :any = {
    cutout: '80%',
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: 'start',
      },
    }
  }

  useEffect(() => {
    if (init) return;
    getNumberOfReports().then((reports) => {
      let labels: string[] = [];
      let online: boolean = navigator.onLine;

      if (reports?.length !== undefined) {
        let local: string = ' ' + reports[0].toString();
        let remote: string = ' ' + reports[1].toString();
        let sync: string = '';
        if (reports?.length > 2) sync = ' ' + reports[2].toString();

        labels = online ? ['Local Reports' + local,
                            'Remote Reports' + remote,
                            'Reports to synchronise' + sync]
                            :
                            ['Local Reports' + local,
                            'Remote Reports' + remote];
      } else {
        labels = online ? ['Local Reports ',
                          'Remote Reports',
                          'Reports to synchronise']
                          :
                          ['Local Reports',
                          'Remote Reports'];
      }

      let copyData = {
        labels: labels,
        datasets: [{
          label: 'Reports',
          data: reports,
          backgroundColor: [
            'rgb(13, 110, 253)', 'rgb(220,53,69)', 'rgb(25,135,84)'
          ],
          borderColor: [
            'rgb(255, 255, 255)'
          ],
          borderWidth: 1,
        }]
      };
      setData(copyData);
      setInit(true);
    });
  });

  return (<div className='DoughnutChart'>
            <p className='Headline'>Open Reports</p>
            <div className='Chart'>
              {data ? <Doughnut className='Chart' data={data} options={ChartOptions}/> 
              :
              <></>}
            </div>  
          </div>);
};

