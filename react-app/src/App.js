import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Review from './pages/Review';
import Loading from './components/Loading';
import logo from './assets/logo.png';
// import profile from './assets/profile.png';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      document.querySelector('.App').classList.add('loaded');
    }
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <div className="curved-square"></div>
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
          <Route path="/review" element={<Review />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;