import { Route, Routes } from 'react-router-dom';
import WriteNew from "./new";
import * as Edit from "./edit";
import Editor from './edit/editor';

export const Write = () => {

  return (
    <Routes>
      <Route path='*' element={<></>} />
      <Route path="/new" element={<WriteNew />} />
      <Route path="/new/:title" element={<WriteNew />} />

      <Route path='/edit' element={<Edit.default.EditOverview />} />
      <Route path='/edit/:ReportTitel_OR_ID' element={<Edit.default.Editor />} />
    </Routes>
  );
};

export default Write;