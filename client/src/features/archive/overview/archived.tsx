import { useEffect, useState } from "react";
import { IDB_Archive } from "../../../types/IDB_Archive";
import axios from "axios";
import ReportFilter, { ReportFieldSelect } from "../../../types/ReportFilter";

export const Archived = () => {
  const [reports, setReports] = useState<IDB_Archive[]>([]);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init)
      return;


    const filter: ReportFilter = {
      archived: true,
    };

    const select: ReportFieldSelect = {
      id: true,
      title: true,
      date_created: true,
      description: true,
      author_name: true,
    }

    axios.post(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report`, { filter: filter, select: select });
  }, [init, reports]);


  return (<></>)
}

export default Archived;