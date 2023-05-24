import { Route, Routes } from 'react-router-dom';
import WriteNew from "./new";
import Overview from './overview';
import Editor from './edit';

export const Write = () => {

  return (
    <Routes>
      <Route path='*' element={<Overview/>} />
      <Route path="/new" element={<WriteNew />} />
      <Route path="/new/:title" element={<WriteNew />} />
      <Route path='/edit/:ReportTitel_OR_ID' element={<Editor />} />
    </Routes>
  );
};

export default Write;