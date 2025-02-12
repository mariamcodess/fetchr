import React from 'react';
import { BrowserRouter as Router, Routes, Route } from'react-router-dom';
import LoginSignUp from './Components/LoginSignUp/LoginSignUp';
import Home from './Components/Home/Home';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<LoginSignUp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
