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
import { Bar, Doughnut } from 'react-chartjs-2';
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



async function getReports(){
  let numberOfLocalReports :number = 0;
  let localReports: IDB_Report[] = [];

  let numberOfRemoteReports :number = 0;
  let remoteReports: IDB_Report[] = [];

  let numberOfSyncReports :number = 0;

  await ReportDB.getAllReports("remote").then(
    response => {
      numberOfRemoteReports = response.length;
      remoteReports = response;
    }
  );

  await ReportDB.getAllReports("local").then(
    response => {
      response.forEach((local:any) => {
        remoteReports.forEach((remoteReport:any) => {
          if (local.id == remoteReport.id) {
            localReports.push(local);
          }
        })
      })
    }
  );

  numberOfLocalReports = localReports.length;

  if (navigator.onLine) {
    const filter: ReportFilter = {
      author_id: [1], //TODO: Get own ID
      archived: false,
    };

    const select: ReportFieldSelect = {
      id: true,
      title: true,
      date_modified: true,
    }

    let allSyncedReports: any[] = [];

    const res = await axios.post(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report`, { filter: filter, select: select });
    if (!res.data.success) return;
    allSyncedReports = res.data.data as any[]; //TODO: type

    localReports.forEach((localReport:any) =>{
      remoteReports.forEach((remoteReport:any) =>{
        allSyncedReports.forEach((syncReport:any) =>{
          if (((localReport.id === syncReport.id) && (syncReport.id === remoteReport.id))) {
            console.log(localReport.id);
            console.log(syncReport.id)
            console.log("Error!!!");
          }
        });
      });
    });

    remoteReports.forEach((remoteReport:any) =>{
      allSyncedReports.forEach((syncReport:any) =>{
        if (remoteReport.id !== syncReport.id) {
          numberOfSyncReports += 1;
        }
      });
    });

  }
  
  //console.log([localReports, remoteReports])
  return navigator.onLine ? [numberOfLocalReports, numberOfRemoteReports, numberOfSyncReports] : [numberOfLocalReports, numberOfRemoteReports];
}

export const DemoComponent = () => {
  //const labels = navigator.onLine ? ['Local Reports ', 'Remote Reports', 'Reports to synchronise'] : ['Local Reports', 'Remote Reports'];
  const [data, setData] = useState<any>();
  const [init, setInit] = useState<boolean>(false);

  useEffect(()=>{
    if (init) return;
    getReports().then((e) => {
      if (e?.length !== undefined){
        let local: string = ' ' + e[0].toString();
        let remote: string = ' ' + e[1].toString();
        let sync: string = '';
        if (e?.length > 2) sync = ' ' + e[2].toString();

        var labels = navigator.onLine ? ['Local Reports' + local, 'Remote Reports' + remote, 'Reports to synchronise' + sync] : ['Local Reports'+local, 'Remote Reports'+remote];
      } else {
        var labels = navigator.onLine ? ['Local Reports ', 'Remote Reports', 'Reports to synchronise'] : ['Local Reports', 'Remote Reports'];
      }

      let copyData = {
        labels: labels,
        datasets: [{
          label: 'Expenses by Month',
          data: e,
          backgroundColor: [
            'rgb(153, 102, 255)', 'rgb(0,255,255)', 'rgb(0,0,255)'
          ],
          borderColor: [
            'rgb(255, 255, 255)'
          ],
          borderWidth: 1
        }]
      };
      setData(copyData);
      setInit(true);
    });
  });

  return (<>{data ? <Doughnut data={data}/> : <></>}</>);
};

