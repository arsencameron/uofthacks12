import React, { useState } from 'react';
import SearchBar from './searchbar';
import GoogleMap from './GoogleMap';
import PromptBar from './promptbar';
import './LeftSection.css';

function LeftSection({ activeTab, setActiveTab, handleSearch, handlePrompt }) {
  return (
    <div className="left-section">
      <header className="App-header">
        Explore Accessibility
      </header>
      <div className="tabs-container">
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
            Generate✨
          </button>
        </div>
        {activeTab === 'search' && <SearchBar onSearch={handleSearch} />}
        {activeTab === 'generate' && <PromptBar onPrompt={handlePrompt}/>}
      </div>
      <GoogleMap />
    </div>
  );
}

export default LeftSection;