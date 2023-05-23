import { Route, Routes } from 'react-router-dom';
import WriteNew from "./new";
import * as Edit from "./edit";

export const Write = () => {

  return (
    <Routes>
      <Route path='*' element={<></>} />
      <Route path="/new" element={<WriteNew />} />
      <Route path="/new/:title" element={<WriteNew />} />

      <Route path='/edit' element={<Edit.Overview />} />
      <Route path='/edit/:ReportTitel_OR_ID' element={<Edit.Editor />} />
    </Routes>
  );
};

export default Write;