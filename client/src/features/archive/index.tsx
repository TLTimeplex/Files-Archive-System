import { Route, Routes } from 'react-router-dom';
import Overview from './overview';
import ViewArchive from './view';

export const Archive = () => {

  return (
    <Routes>
      <Route path='*' element={<Overview />} />
      <Route path='/:archiveID' element={<ViewArchive />} />
    </Routes>
  );
};

export default Archive;