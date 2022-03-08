import './styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Auth from './components/Auth';
import { BrowserRouter, Route, Routes } from "react-router-dom";


ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<App />}  />
    </Routes>
  </BrowserRouter>
  , document.getElementById('root')
);