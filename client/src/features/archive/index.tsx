import { Route, Routes } from 'react-router-dom';
import Overview from './overview';

export const Archive = () => {

  return (
    <Routes>
      <Route path='*' element={<Overview/>} />
      <Route path='/:archiveID' element={<></>} />
    </Routes>
  );
};

export default Archive;