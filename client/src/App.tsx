import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Route, useLocation, Routes } from 'react-router-dom';
import './App.css';
import Main from './features/main';
import Login from './features/login';
import { RouteCustoms } from './modules/RouteCustoms';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='*' element={<RouteCustoms element={<Main />} blocked={["/login"]} />} />
        <Route path='/login' element={<Login />}  />
      </Routes>
    </Router>
  );
}

export default App;
