import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WriteNew from "./new";
import WriteEdit from "./edit";

export const Write = () => {

  return (
    <Routes>
      <Route path='*' element={<></>} />
      <Route path="/new" element={<WriteNew />} />
      <Route path='/edit' element={<WriteEdit />} />
    </Routes>
  );
};

export default Write;