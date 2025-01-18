import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Signup from './pages/Signup';
import logo from './assets/logo.png';

function App() {
  return (
    <Router>
      <div className="App">
        <Link to="/">
          <img src={logo} alt="Home" className="nav-logo" />
        </Link>
        <nav>
          <ul>
            <li>
              <Link to="/signup">
                {/* <img src={profile} alt="Signup" className="profile" /> */}
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;