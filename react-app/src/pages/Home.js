// Home.js
import React, { useState } from 'react';
import LeftSection from '../components/LeftSection';
import RightSection from '../components/RightSection';
import './Home.css';

function Home() {
  const [activeTab, setActiveTab] = useState('search');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleSearch = (searchTerm) => {
    console.log('Search Term:', searchTerm);
    // Add your search logic here
  };

  const handlePrompt = (promptTerm) => {
    console.log('Prompt Term:', promptTerm);
    // Add your prompt logic here
  };

  return (
      <div className="home-container">
        <LeftSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleSearch={handleSearch}
            handlePrompt={handlePrompt}
            setSelectedPlace={setSelectedPlace} // Pass the setter to LeftSection
        />
        <RightSection selectedPlace={selectedPlace} /> {/* Pass selectedPlace to RightSection */}
      </div>
  );
}

export default Home;
