import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Route, useLocation, Routes } from 'react-router-dom';
import './App.css';
import Main from './features/main';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='*' element={<BlockUrl element={<Main />} />} />
        <Route path='/login' element={<></>}  />
      </Routes>
    </Router>
  );
}

interface BlockUrlProps {
  element: JSX.Element;
}

const BlockUrl = ({element} : BlockUrlProps) : JSX.Element => {
  const location = useLocation();

  const bannedUrls = ["/login"];

  if(bannedUrls.includes(location.pathname))
    return <></>;

  else
    return element;
}

export default App;
