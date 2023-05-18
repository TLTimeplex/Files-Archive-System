import { Route, Routes } from 'react-router-dom';
import WriteNew from "./new";
import WriteEdit from "./edit";

export const Write = () => {

  return (
    <Routes>
      <Route path='*' element={<></>} />
      <Route path="/new" element={<WriteNew />} />
      <Route path="/new/:title" element={<WriteNew />} />

      <Route path='/edit' element={<WriteEdit />} />
      <Route path='/edit/:file' element={<WriteEdit />} />
    </Routes>
  );
};

export default Write;