import React, { useState } from 'react';
import LeftSection from '../components/LeftSection';
import RightSection from '../components/RightSection';
import './Home.css';

function Home() {
    const [selectedPlace, setSelectedPlace] = useState(null); // Centralized state for selected place
    const [activeTab, setActiveTab] = useState('search'); // Manage active tab (search or generate)

    const handleSearch = (searchTerm) => {
        console.log('Search Term:', searchTerm);

        // Example: Simulating a search and setting a place
        const simulatedPlace = {
            lat: 43.6532,
            lng: -79.3832,
            name: `Simulated Place for "${searchTerm}"`,
            address: '123 Example Street, Toronto, ON',
        };
        setSelectedPlace(simulatedPlace);
    };

    const handlePrompt = (promptTerm) => {
        console.log('Prompt Term:', promptTerm);
        // Add logic for prompt handling if needed
    };

    return (
        <div className="home-container">
            <LeftSection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleSearch={handleSearch} // Pass search handler
                handlePrompt={handlePrompt} // Pass prompt handler
                setSelectedPlace={setSelectedPlace} // Pass map click handler
            />
            <RightSection selectedPlace={selectedPlace} /> {/* Pass selectedPlace */}
        </div>
    );
}

export default Home;
