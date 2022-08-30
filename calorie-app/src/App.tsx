import React from 'react';
import logo from './logo.svg';
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { CssVarsProvider } from '@mui/joy/styles';
import Home from "./components/Home"
import Admin from './components/Admin/Admin';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import UserAdmin from './components/Admin/User';


function App() {
  return (
    <CssVarsProvider>
      <div className="App">
        <h1>Simple Calorie App</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/users/:id" element={<UserAdmin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </CssVarsProvider >
  );
}

export default App