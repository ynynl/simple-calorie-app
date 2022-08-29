import React from 'react';
import logo from './logo.svg';
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { CssVarsProvider } from '@mui/joy/styles';
import Home from "./components/Home"

function App() {
  return (
    <CssVarsProvider>
      <div className="App">
        <h1>Simple Calorie App</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
        </Routes>
      </div>
    </CssVarsProvider >
  );
}

// App.js


function About() {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>
          That feels like an existential question, don't you
          think?
        </p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}

export default App