import { useParams } from 'react-router-dom';
import { ReportDB } from "../../../scripts/IndexedDB";
import { Spinner } from 'react-bootstrap';
import "./style.css";

export const WriteNew = () => {

  const { title } = useParams();

  ReportDB.createReport(title).then((reportID) => {
    window.location.href = "/write/edit/" + reportID;
  })

  return (
    <div className="LoadingBox">
      <Spinner animation="border" variant="primary" className='LoadingSpinner'/>
      <h2>Creating new Report...</h2>
    </div>
  );
};

export default WriteNew;