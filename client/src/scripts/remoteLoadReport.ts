import axios from "axios";
import ReportFilter, { ReportFieldSelect } from "../types/ReportFilter";

export const remoteLoadReport = async (reportID: string) => {
  const filter: ReportFilter = {
    id: reportID,
  };

  const select : ReportFieldSelect = {
    id: true,
    date_modified: true,
  }

  const res = await axios.post(`/api/1/${localStorage.getItem("token") || sessionStorage.getItem("token")}/report`, { filter: filter, select: select });
};

export default remoteLoadReport;