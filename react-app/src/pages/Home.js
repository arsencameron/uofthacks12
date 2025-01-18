import React, { useState } from 'react';
import LeftSection from '../components/LeftSection';
import RightSection from '../components/RightSection';
import './Home.css';

function Home() {
  const [activeTab, setActiveTab] = useState('search');

  const handleSearch = (searchTerm) => {
    console.log('Search Term:', searchTerm);
    // Add your search logic here
  };

  return (
    <div className="home-container">
      <LeftSection activeTab={activeTab} setActiveTab={setActiveTab} handleSearch={handleSearch} />
      <RightSection />
    </div>
  );
}

export default Home;