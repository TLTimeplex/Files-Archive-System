import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './features/main';
import Login from './features/login';
import Write from './features/write';
import { RouteCustoms } from './modules/RouteCustoms';


const App = () => {
  return (
    <Router>
      <RouteCustoms element={<Main />} blocked={["/login"]} />
      <Routes>
        <Route path='*' element={<></>} />
        <Route path='/login' element={<Login />} />
        <Route path="/report/*" element={<Write />} />
      </Routes>
    </Router>
  );
}

export default App;
