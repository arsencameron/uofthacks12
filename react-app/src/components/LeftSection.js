import React, { useState } from 'react';
import SearchBar from './searchbar';
import GoogleMap from './GoogleMap';
import './LeftSection.css';

function LeftSection({ activeTab, setActiveTab, handleSearch }) {
  return (
    <div className="left-section">
      <header className="App-header">
        Explore Accessibility
      </header>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button
          className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          Generate
        </button>
      </div>
      {activeTab === 'search' && <SearchBar onSearch={handleSearch} />}
      {activeTab === 'generate' && <div>Generate Content Here</div>}
      <GoogleMap />
    </div>
  );
}

export default LeftSection;