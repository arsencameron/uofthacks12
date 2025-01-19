// LeftSection.js
import React from 'react';
import SearchBar from './searchbar';
import GoogleMap from './GoogleMap';
import PromptBar from './promptbar';
import './LeftSection.css';

function LeftSection({ activeTab, setActiveTab, handleSearch, handlePrompt, setSelectedPlace, selectedPlace }) {
    return (
        <div className="left-section">
            <header className="App-header">Explore Accessibility</header>
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
                {activeTab === 'generate' && <PromptBar onPrompt={handlePrompt} />}
            </div>
            <GoogleMap selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} /> {/* Pass setSelectedPlace */}
        </div>
    );
}

export default LeftSection;
