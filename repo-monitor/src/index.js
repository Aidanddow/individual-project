import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App'
import Repository from './pages/Repository'
import Commit from './pages/Commit'
import Developer from './pages/Developer'
import GridView from './pages/GridView'
import SetToken from "./pages/SetToken"
import Navbar from './components/Navbar'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Navbar />
    
      <Routes>
        <Route path="/" element={<GridView />} />
        <Route path="repository/:id" element={<Repository />} />
        <Route path="repository/:id/commit/:sha" element={<Commit />} />
        <Route path="grid/" element={<GridView />} />
        <Route path="settoken/" element={<SetToken />} />
        <Route path="developer/:id" element={<Developer />} />
      </Routes>
    
  </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
