import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserTable from './components/UserTable';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  const [inputUrl, setInputUrl] = useState('https://docs.google.com/spreadsheets/d/1t7GoAL320zdFL7yQMo8ZfTI0cgqvANbbx6TvPYJTHMA/edit?usp=sharing');

  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="content-container">
          <h1 className="app-title">Task Sheet</h1>
          <Routes>
            <Route path="/" element={<UserTable inputUrl={inputUrl} setInputUrl={setInputUrl} />} />
          </Routes>
        </div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </BrowserRouter>
  );
}

export default App;