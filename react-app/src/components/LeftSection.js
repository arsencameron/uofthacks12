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
                        Generate ✨
                    </button>
                </div>
                {/* {activeTab === 'search' && (
                    <div className="search-filter-container">
                        <SearchBar onSearch={handleSearch} />
                        <div className="filter-bar">
                            <label htmlFor="filter">Filter by:</label>
                            <select id="filter" name="filter" multiple>
                            <option value="wheelchair-accessible">Wheelchair Accessible</option>
                                <option value="stroller-friendly">Stroller-Friendly</option>
                                <option value="level-access">Level Access</option>
                                <option value="accessible-restrooms">Accessible Restrooms</option>
                                <option value="blind-friendly">Blind-Friendly</option>
                                <option value="low-vision-friendly">Low Vision-Friendly</option>
                                <option value="deaf-friendly">Deaf-Friendly</option>
                                <option value="acoustics">Acoustics</option>
                                <option value="quiet-spaces">Quiet Spaces</option>
                                <option value="clear-signage">Clear Signage</option>
                                <option value="sensory-friendly">Sensory-Friendly</option>
                                <option value="language-accessibility">Language Accessibility</option>
                                <option value="speech-friendly">Speech-Friendly</option>
                                <option value="allergy-friendly">Allergy-Friendly</option>
                                <option value="diet-specific-options">Diet-Specific Options</option>
                                <option value="parking-accessibility">Parking Accessibility</option>
                                <option value="service-animal-friendly">Service Animal Friendly</option>
                                <option value="public-transportation-access">Public Transportation Access</option>
                            </select>
                        </div>
                    </div>
                )} */}
                {activeTab === 'search' && <SearchBar onSearch={handleSearch} />}
                {activeTab === 'generate' && <PromptBar onPrompt={handlePrompt} />}
            </div>
            <GoogleMap selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} /> {/* Pass setSelectedPlace */}
        </div>
    );
}

export default LeftSection;
