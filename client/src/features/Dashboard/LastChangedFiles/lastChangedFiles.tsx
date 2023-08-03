import { ArchiveDB, ReportDB } from '../../../scripts/IndexedDB';
import { IDB_Archive } from '../../../types/IDB_Archive';
import IDB_Report from '../../../types/IDB_report';
import './lastChangedFiles.css'
import { useEffect, useState } from 'react';


interface Archive_Date {
    updatedAt: Date, 
    id: string,
    title?: string, 
    discription?: string
}

async function getlastReports(numberOfLastReports :number) {
    //const allReports: IDB_Report[] = await ReportDB.getAllReports("all");
    const allArchive: IDB_Archive[] = await ArchiveDB.getAllArchive();

    let Archive: Archive_Date[] = [];
    let clearArchive: Archive_Date[] = [];
    let sortedArchive: Archive_Date[] = [];

    //verify all Reports have an update date and convert into Report_Data (shorter Interface)
    allArchive.forEach((arch) => {
        if (arch.meta.date !== undefined) {
            Archive.push({
                updatedAt: arch.meta.date,
                id: arch.id,
                title: arch.data.title,
                discription: arch.data.description,
            })
        }
    });

    //remove double elemets 
    let doubleReports :Archive_Date[][] = [];
    Archive.forEach((report, index) => {
        doubleReports.push([]);
        doubleReports.at(index)?.push(report);
        Archive.forEach((innerReport, innerIndex) => {
            if ((report.id === innerReport.id) && (index !== innerIndex)){
                doubleReports.at(index)?.push(innerReport);
            }
        });
    });

    doubleReports.forEach((reports) => {
        if (reports.length === 1){
            reports.forEach((report) => {clearArchive.push(report)});
        } else {
            let updatedRepord: Archive_Date = {
                updatedAt: new Date(),
                id: ''
            }; //set standard Value

            let maxDate: Date;
            let indexMaxDate: number = 0;
            reports.forEach((report, index) =>{
                if (index === 0) {
                    maxDate = report.updatedAt;
                    indexMaxDate = index;
                } else {
                    if (maxDate < report.updatedAt){
                        maxDate = report.updatedAt;
                        indexMaxDate = index;
                    }
                }
            });
            
            reports.forEach((report, index) => {
                if (index === indexMaxDate) updatedRepord = report;
            });

            let tempReport: Archive_Date|undefined = clearArchive.find((report) => report === updatedRepord);
            if (tempReport !== undefined){
                clearArchive.push(updatedRepord);
            }
        }
    });

    //sorted the first numberOfLastReports by date and return 
    if (clearArchive.length > 0) {
        let maxDate: Date;
        let maxDateIndex: number = 0;
        let reportMaxDate: Archive_Date = {
            id: '',
            updatedAt: new Date(),
        };

        for (let i = 0; i<numberOfLastReports; i++){
            if (clearArchive.length === 0) break;
            clearArchive.forEach((report, index) => {
                if (index === 0) {
                    maxDate = report.updatedAt;
                    reportMaxDate = report;
                    maxDateIndex = index;
                }     
                else if (maxDate < report.updatedAt) {
                    maxDate = report.updatedAt;
                    reportMaxDate = report;
                    maxDateIndex = index;
                }
            });

            sortedArchive.push(reportMaxDate);
            clearArchive.splice(maxDateIndex, 1);
        }
    }
    return (sortedArchive);
}

const lastReportsElement = (Reports: Archive_Date[]) => {
    
    const rewriteDateHour = (dateHour: string|undefined) => {
        if (dateHour !== undefined){
            if (dateHour.length <= 1) {
                return '0' + dateHour;
            }
            else {
                return dateHour;
            }
        }
        else return '';
    }

    const singleElement = (index: number) => {
        let time:string = rewriteDateHour(Reports.at(index)?.updatedAt.getHours().toString()) + ':' + 
                          rewriteDateHour(Reports.at(index)?.updatedAt.getMinutes().toString())   + ' ' +
                          rewriteDateHour(Reports.at(index)?.updatedAt.getDate().toString())    + '.' +
                          rewriteDateHour(Reports.at(index)?.updatedAt.getMonth().toString())   + '.' +
                          rewriteDateHour(Reports.at(index)?.updatedAt.getFullYear().toString());

        const clickSingleReport = () =>{
            window.location.href = `/archive/${Reports.at(index)?.id}`
        }

        let singleReportHoverText =  `/report/edit/${Reports.at(index)?.id}`;
        let titleText = (Reports.at(index)?.title) ? Reports.at(index)?.title : "No title";
        let discriptionText = (Reports.at(index)?.discription !== undefined) ? Reports.at(index)?.discription : "No discription";


        return (<div className='SingleReport' onClick={clickSingleReport} title={singleReportHoverText}>
                    <p className='title'>{titleText}</p>
                    <p className='discription'><span className='discriptionBold'>Discription:</span><br></br>
                                               <span className='discriptionItalic'>{discriptionText}</span> 
                    </p>
                    <p className='date'>{time}</p>
                </div>);
    }

    let returnElement : JSX.Element[] = [];
    for (let i = 0; i < Reports.length; i++){
        returnElement.push(singleElement(i));
    }

    return (<div className='lastReports'>
                {returnElement}
            </div>)
}


export const LastFileChanged = () =>{
    const [init, setInit] = useState<boolean>(false);
    const [lastupdatedReports, setReport] = useState<Archive_Date[]>();
    const numberOfShownReports :number = 3;
    
 
    useEffect(() => {
        if (init) return;
        getlastReports(numberOfShownReports).then((reports) => {
            let innerLastUpdatedReports: Archive_Date[] = [];
            reports.forEach((report) => {
                innerLastUpdatedReports.push(report);
            });
            setReport(innerLastUpdatedReports);
            setInit(true);
        });
    });

    return (<div className='Feed'>
                <p className='HeadLine'>Archive Feed</p>
                <div> 
                    {lastupdatedReports ? 
                        lastReportsElement(lastupdatedReports)
                    : <></>}
                </div>
            </div>
            );
};